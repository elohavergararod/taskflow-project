document.addEventListener("DOMContentLoaded", () => {

    const taskList = document.querySelector(".task-list");
    const taskInput = document.getElementById("taskInput");
    const prioritySelect = document.getElementById("prioritySelect");
    const categorySelect = document.getElementById("categorySelect");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const searchInput = document.getElementById("searchInput");

    const filterAll = document.getElementById("filterAll");
    const filterPending = document.getElementById("filterPending");
    const filterCompleted = document.getElementById("filterCompleted");

    let tasks = [];

    function capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function createTaskElement(task) {

        const li = document.createElement("li");
        li.classList.add("task-item");

        const categoryFormatted = capitalize(task.category);
        const priorityFormatted = capitalize(task.priority);
        const statusFormatted = capitalize(task.status);

        if (task.status === "completed") {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div class="task-info">
                <p class="task-title">${task.title}</p>
                <p class="task-category">${categoryFormatted}</p>
                <p class="task-status">${statusFormatted}</p>
            </div>
            <span class="badge ${task.priority}">${priorityFormatted}</span>
            <button class="delete-btn">X</button>
        `;

        li.querySelector(".delete-btn").addEventListener("click", () => {

            const completed = confirm("Is this task completed?");

            if (completed) {
                task.status = "completed";
                li.classList.add("completed");
            } else {
                tasks = tasks.filter(t => t.id !== task.id);
                li.remove();
            }

            saveTasks();
        });

        taskList.appendChild(li);
    }

    function addTask() {

        const text = taskInput.value.trim();
        const category = categorySelect.value;
        const priority = prioritySelect.value;

        if (text === "") return;

        const newTask = {
            id: Date.now(),
            title: text,
            priority: priority,
            category: category,
            status: "pending"
        };

        tasks.push(newTask);

        createTaskElement(newTask);

        saveTasks();

        taskInput.value = "";
    }

    function loadTasks() {

        const storedTasks = localStorage.getItem("tasks");

        if (!storedTasks) return;

        tasks = JSON.parse(storedTasks).map(task => ({
            ...task,
            status: task.status || "pending"
        }));

        tasks.forEach(task => createTaskElement(task));
    }

    searchInput.addEventListener("keyup", () => {

        const searchText = searchInput.value.toLowerCase();
        const items = document.querySelectorAll(".task-item");

        items.forEach(item => {

            const title = item.querySelector(".task-title").textContent.toLowerCase();

            item.style.display = title.includes(searchText) ? "flex" : "none";

        });
    });

    filterAll.addEventListener("click", () => {

        document.querySelectorAll(".task-item").forEach(task => {
            task.style.display = "flex";
        });

    });

    filterPending.addEventListener("click", () => {

        document.querySelectorAll(".task-item").forEach(task => {

            task.style.display = task.classList.contains("completed")
                ? "none"
                : "flex";

        });

    });

    filterCompleted.addEventListener("click", () => {

        document.querySelectorAll(".task-item").forEach(task => {

            task.style.display = task.classList.contains("completed")
                ? "flex"
                : "none";

        });

    });

    addTaskBtn.addEventListener("click", addTask);

    loadTasks();

});