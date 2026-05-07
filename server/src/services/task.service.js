let tasks = [];

const obtainAll = () => tasks;

const createTask = (data) => {
  const newTask = { id: Date.now(), ...data };
  tasks.push(newTask);
  return newTask;
};

const deleteTask = (id) => {
  const index = tasks.findIndex(t => t.id == id);
  if (index === -1) throw new Error("NOT_FOUND");
  tasks.splice(index, 1);
};

module.exports = {
  obtainAll,
  createTask,
  deleteTask
};