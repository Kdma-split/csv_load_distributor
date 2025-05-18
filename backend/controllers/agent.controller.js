const asyncHandler = require('express-async-handler');
const Agent = require('../models/agent.model.js');

// @desc    Create new agent
// @route   POST /api/agents
// @access  Private (Admin only)
exports.createAgent = asyncHandler(async (req, res) => {
  const { name, email, mobileNumber, password } = req.body;
  
  const agentExists = await Agent.findOne({ email });
  
  if (agentExists) {
    res.status(400);
    throw new Error('Agent with this email already exists');
  }
  
  const agent = await Agent.create({
    name,
    email,
    mobileNumber,
    password,
    createdBy: req.user.id
  });
  
  res.status(201).json({
    success: true,
    data: {
      id: agent._id,
      name: agent.name,
      email: agent.email,
      mobileNumber: agent.mobileNumber
    }
  });
});

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private (Admin only)
exports.getAgents = asyncHandler(async (req, res) => {
  const agents = await Agent.find({ createdBy: req.user.id })
    .select('-password')
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: agents.length,
    data: agents
  });
});

// @desc    Get single agent
// @route   GET /api/agents/:id
// @access  Private (Admin only)
exports.getAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id).select('-password');
  
  if (!agent) {
    res.status(404);
    throw new Error('Agent not found');
  }
  
  // Make sure user is the agent creator
  if (agent.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to access this agent');
  }
  
  res.status(200).json({
    success: true,
    data: agent
  });
});

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private (Admin only)
exports.updateAgent = asyncHandler(async (req, res) => {
  let agent = await Agent.findById(req.params.id);
  
  if (!agent) {
    res.status(404);
    throw new Error('Agent not found');
  }
  
  // Make sure user is the agent creator
  if (agent.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this agent');
  }
  
  // Fields to update
  const fieldsToUpdate = {};
  if (req.body.name) fieldsToUpdate.name = req.body.name;
  if (req.body.email) fieldsToUpdate.email = req.body.email;
  if (req.body.mobileNumber) fieldsToUpdate.mobileNumber = req.body.mobileNumber;
  
  agent = await Agent.findByIdAndUpdate(
    req.params.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');
  
  res.status(200).json({
    success: true,
    data: agent
  });
});

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private (Admin only)
exports.deleteAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  
  if (!agent) {
    res.status(404);
    throw new Error('Agent not found');
  }
  
  // Make sure user is the agent creator
  if (agent.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this agent');
  }
  
  await agent.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});