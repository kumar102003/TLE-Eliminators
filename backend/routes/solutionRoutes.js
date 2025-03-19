const express = require('express');
const router = express.Router();
const {
  getAllSolutions,
  addSolution
} = require('../controllers/solutionController');

// Get all solutions
router.get('/', getAllSolutions);

// Add new solution
router.post('/', addSolution);

module.exports = router; 