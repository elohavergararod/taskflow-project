import { getTasks, createTask, deleteTask as deleteTaskApi } from "../api/client.js";

export const TaskService = {
    getAll: () => getTasks(),
    create: (task) => createTask(task),
    delete: (id) => deleteTaskApi(id)
};