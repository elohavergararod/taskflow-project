const taskService = require("../services/task.service");

const getTasks = (req, res) => {
  res.json(taskService.obtainAll());
};

const createTask = (req, res) => {
  const task = taskService.createTask(req.body);
  res.status(201).json(task);
};

const deleteTask = (req, res) => {
  try {
    taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask
};