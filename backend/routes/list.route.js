const express = require('express');
const {
  upload,
  uploadList,
  getDistributionSummary,
  getBatchDetails,
  getAgentLists
} = require('../controllers/list.controller.js');
const { protect, authorize } = require('../middlewares/auth.middleware.js');

const router = express.Router();

// Upload new list
router.post('/upload', protect, authorize('admin'), (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadList);

// Get distribution summary
router.get('/summary', protect, authorize('admin'), getDistributionSummary);

// Get batch details
router.get('/batch/:batchId', protect, authorize('admin'), getBatchDetails);

// Get lists for a specific agent
router.get('/agent/:agentId', protect, authorize('admin'), getAgentLists);

module.exports = router;