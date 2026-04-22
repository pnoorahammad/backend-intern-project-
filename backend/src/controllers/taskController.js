const { Task } = require('../models');

const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const query = req.user.role === 'admin' ? {} : { userId: req.user.id };

    const tasks = await Task.findAndCountAll({
      where: query,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      totalItems: tasks.count,
      totalPages: Math.ceil(tasks.count / limit),
      currentPage: page,
      tasks: tasks.rows
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Only allow admin or the creator of the task to view it
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = await Task.create({
      title,
      description,
      userId: req.user.id
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, description, status } = req.body;

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only allow admin or the creator of the task to delete it
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await task.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
