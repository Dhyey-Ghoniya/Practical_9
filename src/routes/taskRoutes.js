const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getTasks);
router.get('/uncached', taskController.getTasksUncached);
router.get('/cache-stats', taskController.getStats);
router.post('/', taskController.createTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;