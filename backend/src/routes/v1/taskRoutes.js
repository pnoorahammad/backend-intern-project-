const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../../controllers/taskController');
const authMiddleware = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const validateRequest = require('../../middlewares/validateMiddleware');
const { taskSchema } = require('../../validators/taskValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validateRequest(taskSchema), createTask);
router.put('/:id', validateRequest(taskSchema), updateTask);
router.delete('/:id', deleteTask);

// Example of an admin-only route for tasks could be here
// router.delete('/admin/:id', roleMiddleware(['admin']), deleteTask);

module.exports = router;
