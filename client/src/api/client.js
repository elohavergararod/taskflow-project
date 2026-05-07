const API_URL = "http://localhost:3000/api/v1/tasks";

export const getTasks = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error loading tasks");
  }

  return response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error("Error creating task");
  }

  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error deleting task");
  }
};