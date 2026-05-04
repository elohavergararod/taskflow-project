let tasks = [];

const obtenerTodas = () => tasks;

const crearTarea = (data) => {
  const newTask = { id: Date.now(), ...data };
  tasks.push(newTask);
  return newTask;
};

const eliminarTarea = (id) => {
  const index = tasks.findIndex(t => t.id == id);
  if (index === -1) throw new Error("NOT_FOUND");
  tasks.splice(index, 1);
};

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea
};