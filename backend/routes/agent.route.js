const express = require('express');
const {
  createAgent,
  getAgents,
  getAgent,
  updateAgent,
  deleteAgent
} = require('../controllers/agent.controller.js');
const { protect, authorize } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createAgent)
  .get(protect, authorize('admin'), getAgents);

router
  .route('/:id')
  .get(protect, authorize('admin'), getAgent)
  .put(protect, authorize('admin'), updateAgent)
  .delete(protect, authorize('admin'), deleteAgent);

module.exports = router;