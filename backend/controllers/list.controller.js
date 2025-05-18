const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const multer = require('multer');
const XLSX = require('xlsx');
const Agent = require('../models/agent.model.js');
const ListItem = require('../models/listItem.model.js');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /csv|xlsx|xls/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only CSV, XLSX, and XLS files are allowed!'));
  }
};

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
}).single('file');

const parseFile = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  
  if (extension === '.csv') {
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Map column names to our expected format if needed
          const mappedData = {
            firstName: data.FirstName || data.firstname || data['First Name'] || data.Name || data.name || '',
            phone: data.Phone || data.phone || data.PhoneNumber || data.phonenumber || data['Phone Number'] || '',
            notes: data.Notes || data.notes || data.Note || data.note || ''
          };
          
          results.push(mappedData);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  } else if (extension === '.xlsx' || extension === '.xls') {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return data.map(row => ({
      firstName: row.FirstName || row.firstname || row['First Name'] || row.Name || row.name || '',
      phone: row.Phone || row.phone || row.PhoneNumber || row.phonenumber || row['Phone Number'] || '',
      notes: row.Notes || row.notes || row.Note || row.note || ''
    }));
  }
  
  throw new Error('Unsupported file format');
};

const validateData = (data) => {
  const errors = [];
  
  data.forEach((item, index) => {
    if (!item.firstName) {
      errors.push(`Row ${index + 1}: First name is required`);
    }
    
    if (!item.phone) {
      errors.push(`Row ${index + 1}: Phone number is required`);
    }
  });
  
  return errors;
};

// @desc    Upload list file (CSV/Excel) and distribute to agents
// @route   POST /api/lists/upload
// @access  Private (Admin only)
exports.uploadList = asyncHandler(async (req, res) => {
  // Make sure file was uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }
  
  try {
    const filePath = req.file.path;
    const data = await parseFile(filePath);
    
    const validationErrors = validateData(data);
    if (validationErrors.length > 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      
      res.status(400);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    const agents = await Agent.find({ createdBy: req.user.id });
    
    if (agents.length === 0) {
      fs.unlinkSync(filePath);
      
      res.status(400);
      throw new Error('No agents available for distribution');
    }
    
    // Generate a batch ID for this upload
    const batchId = new mongoose.Types.ObjectId();
    
    // Distribute list items among agents
    const numberOfAgents = agents.length;
    const distribution = {};
    
    agents.forEach(agent => {
      distribution[agent._id] = [];
    });
    
    // Distribute items
    data.forEach((item, index) => {
      const agentIndex = index % numberOfAgents;
      const agentId = agents[agentIndex]._id;
      
      distribution[agentId].push({
        ...item,
        assignedTo: agentId,
        uploadBatch: batchId,
        createdBy: req.user.id
      });
    });
    
    // Save items to database
    for (const agentId in distribution) {
      if (distribution[agentId].length > 0) {
        await ListItem.insertMany(distribution[agentId]);
      }
    }
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      message: 'List uploaded and distributed successfully',
      data: {
        totalItems: data.length,
        distribution: Object.keys(distribution).map(agentId => ({
          agentId,
          itemCount: distribution[agentId].length
        }))
      }
    });
  } catch (error) {
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500);
    throw new Error(`File upload failed: ${error.message}`);
  }
});

// @desc    Get distribution summary
// @route   GET /api/lists/summary
// @access  Private (Admin only)
exports.getDistributionSummary = asyncHandler(async (req, res) => {
  // Get all batches
  const batches = await ListItem.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) } },
    { $group: { _id: '$uploadBatch', count: { $sum: 1 }, createdAt: { $first: '$createdAt' } } },
    { $sort: { createdAt: -1 } }
  ]);
  
  res.status(200).json({
    success: true,
    count: batches.length,
    data: batches
  });
});

// @desc    Get distribution details for a batch
// @route   GET /api/lists/batch/:batchId
// @access  Private (Admin only)
exports.getBatchDetails = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  
  // Validate batchId
  if (!mongoose.Types.ObjectId.isValid(batchId)) {
    res.status(400);
    throw new Error('Invalid batch ID');
  }
  
  // Get batch distribution by agent
  const distribution = await ListItem.aggregate([
    {
      $match: {
        uploadBatch: new mongoose.Types.ObjectId(batchId),
        createdBy: new mongoose.Types.ObjectId(req.user.id)
      }
    },
    {
      $lookup: {
        from: 'agents',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'agent'
      }
    },
    { $unwind: '$agent' },
    {
      $group: {
        _id: '$assignedTo',
        agentName: { $first: '$agent.name' },
        agentEmail: { $first: '$agent.email' },
        items: { $push: { firstName: '$firstName', phone: '$phone', notes: '$notes', id: '$_id' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { 'agentName': 1 } }
  ]);
  
  if (distribution.length === 0) {
    res.status(404);
    throw new Error('Batch not found or no items in this batch');
  }
  
  res.status(200).json({
    success: true,
    data: {
      batchId,
      distribution
    }
  });
});

// @desc    Get lists for a specific agent
// @route   GET /api/lists/agent/:agentId
// @access  Private (Admin only)
exports.getAgentLists = asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  
  // Validate agentId
  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    res.status(400);
    throw new Error('Invalid agent ID');
  }
  
  const agent = await Agent.findOne({
    _id: agentId,
    createdBy: req.user.id
  });
  
  if (!agent) {
    res.status(404);
    throw new Error('Agent not found');
  }
  
  // Get lists assigned to the agent grouped by batch
  const lists = await ListItem.aggregate([
    {
      $match: {
        assignedTo: new mongoose.Types.ObjectId(agentId),
        createdBy: new mongoose.Types.ObjectId(req.user.id)
      }
    },
    {
      $group: {
        _id: '$uploadBatch',
        createdAt: { $first: '$createdAt' },
        items: { $push: { firstName: '$firstName', phone: '$phone', notes: '$notes', id: '$_id' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);
  
  res.status(200).json({
    success: true,
    count: lists.length,
    data: {
      agentId,
      agentName: agent.name,
      lists
    }
  });
});