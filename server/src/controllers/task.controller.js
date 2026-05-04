const taskService = require("../services/task.service");

const getTasks = (req, res) => {
  res.json(taskService.obtenerTodas());
};

const createTask = (req, res) => {
  const task = taskService.crearTarea(req.body);
  res.status(201).json(task);
};

const deleteTask = (req, res) => {
  try {
    taskService.eliminarTarea(req.params.id);
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