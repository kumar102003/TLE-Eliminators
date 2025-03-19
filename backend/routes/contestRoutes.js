const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');

// Contest routes
router.get('/contests', contestController.getContests);
router.get('/contests/bookmarked', contestController.getBookmarkedContests);
router.patch('/contests/:id/bookmark', contestController.toggleBookmark);
router.post('/contests/:id/solution-video', contestController.addSolutionVideo);
router.put('/contests/:id/solution-video', contestController.editSolutionVideo);
router.delete('/contests/:id/solution-video', contestController.deleteSolutionVideo);

// Initialize contest updates
const updateInterval = 60 * 60 * 1000; // 1 hour
setInterval(contestController.updateContests, updateInterval);
contestController.updateContests();

module.exports = router; 