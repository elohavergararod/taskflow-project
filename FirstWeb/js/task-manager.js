document.addEventListener("DOMContentLoaded", () => {
    const taskTableBody = document.getElementById("taskBody");
    const taskTitleInput = document.getElementById("taskInput");
    const taskPrioritySelect = document.getElementById("prioritySelect");
    const taskCategorySelect = document.getElementById("categorySelect");
    const addTaskButton = document.getElementById("addTaskBtn");
    const taskSearchInput = document.getElementById("searchInput");
    const taskCounterLabel = document.getElementById("taskCounter");
    const themeToggleButton = document.getElementById("darkToggle");

    const MIN_TITLE_LENGTH = 3;
    const MAX_TITLE_LENGTH = 100;
    const TITLE_ALLOWED_PATTERN = /^[A-Za-z0-9À-ÿ\s.,:;!?()\-_'"]+$/;
    const VALID_PRIORITIES = ["high", "medium", "low"];
    const VALID_CATEGORIES = ["work", "studies", "personal"];

    let taskList = [];
    let activeStatusFilter = "all";
    let activePriorityFilter = "all";
    let activeCategoryFilter = "all";
    let searchQuery = "";

    const PRIORITY_BADGES = {
        high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
        medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
        low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    };

    const CATEGORY_BADGES = {
        work: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        studies: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
        personal: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
    };

    function capitalize(text) {
        if (typeof text !== "string" || text.length === 0) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function validateTaskTitle(title) {
        if (!title) {
            return "Task title is required.";
        }

        if (title.length < MIN_TITLE_LENGTH) {
            return `Task title must be at least ${MIN_TITLE_LENGTH} characters long.`;
        }

        if (title.length > MAX_TITLE_LENGTH) {
            return `Task title must be ${MAX_TITLE_LENGTH} characters or less.`;
        }

        if (!TITLE_ALLOWED_PATTERN.test(title)) {
            return "Task title contains invalid characters.";
        }

        return "";
    }

    function validateTaskOptions(priority, category) {
        if (!VALID_PRIORITIES.includes(priority)) {
            return "Invalid priority selected.";
        }
        if (!VALID_CATEGORIES.includes(category)) {
            return "Invalid category selected.";
        }
        return "";
    }

    function persistTasks() {
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    function updateTaskCounter() {
        const totalTasks = taskList.length;
        const completedTasks = taskList.filter(task => task.status === "completed").length;
        taskCounterLabel.textContent = `${completedTasks}/${totalTasks}`;
    }

    function applyActiveButtonStyles(btn, isActive) {
        btn.classList.toggle("bg-blue-500", isActive);
        btn.classList.toggle("text-white", isActive);
        btn.classList.toggle("bg-gray-200", !isActive);
        btn.classList.toggle("dark:bg-gray-700", !isActive);
    }

    function updateFilterUI() {
        document.querySelectorAll(".pill").forEach(btn => {
            const isActive = btn.dataset.filter === activeStatusFilter;
            applyActiveButtonStyles(btn, isActive);
        });

        document.querySelectorAll("[data-priority]").forEach(btn => {
            const isActive = btn.dataset.priority === activePriorityFilter;
            applyActiveButtonStyles(btn, isActive);
        });

        document.querySelectorAll("[data-category]").forEach(btn => {
            const isActive = btn.dataset.category === activeCategoryFilter;
            applyActiveButtonStyles(btn, isActive);
        });
    }

    function getTaskStatusMarkup(isDone) {
        return isDone
            ? `<span class="text-green-500 font-medium">Completed</span>`
            : `<span class="text-gray-400">Pending</span>`;
    }

    function matchesFilters(task) {
        return (
            (activeStatusFilter === "all" || task.status === activeStatusFilter) &&
            (activePriorityFilter === "all" || task.priority === activePriorityFilter) &&
            (activeCategoryFilter === "all" || task.category === activeCategoryFilter) &&
            task.title.toLowerCase().includes(searchQuery)
        );
    }

    function renderTasks() {
        taskTableBody.innerHTML = "";

        const filteredTasks = taskList.filter(matchesFilters);

        filteredTasks.forEach(task => {
            const isDone = task.status === "completed";
            const taskRow = document.createElement("tr");
            taskRow.className = "border-b dark:border-gray-700";

            taskRow.innerHTML = `
                <td class="py-2">
                    <button class="check-btn text-lg ${isDone ? "text-green-500" : "text-gray-400"}" data-id="${task.id}">
                        ${isDone ? "✓" : "○"}
                    </button>
                </td>
                <td class="py-2">${task.title}</td>
                <td class="py-2">
                    <span class="px-2 py-1 rounded text-xs font-medium ${PRIORITY_BADGES[task.priority]}">
                        ${capitalize(task.priority)}
                    </span>
                </td>
                <td class="py-2">
                    <span class="px-2 py-1 rounded text-xs font-medium ${CATEGORY_BADGES[task.category]}">
                        ${capitalize(task.category)}
                    </span>
                </td>
                <td class="py-2">${getTaskStatusMarkup(isDone)}</td>
                <td class="py-2 flex gap-2">
                    <button class="edit-btn text-blue-500" data-id="${task.id}">Edit</button>
                    <button class="del-btn text-red-500" data-id="${task.id}">✕</button>
                </td>
            `;

            taskTableBody.appendChild(taskRow);
        });

        updateTaskCounter();
        updateFilterUI();
    }

    function createTask(title) {
        return {
            id: Date.now(),
            title,
            priority: taskPrioritySelect.value,
            category: taskCategorySelect.value,
            status: "pending"
        };
    }

    function addTask() {
        const taskTitle = taskTitleInput.value.trim();
        const titleError = validateTaskTitle(taskTitle);
        if (titleError) {
            alert(titleError);
            return;
        }

        const optionsError = validateTaskOptions(taskPrioritySelect.value, taskCategorySelect.value);
        if (optionsError) {
            alert(optionsError);
            return;
        }

        taskList.push(createTask(taskTitle));
        taskTitleInput.value = "";
        persistTasks();
        renderTasks();
    }

    addTaskButton.addEventListener("click", addTask);

    taskTitleInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTask();
        }
    });

    taskTableBody.addEventListener("click", e => {
        const clickedButton = e.target.closest("button");
        if (!clickedButton) return;

        const taskId = Number(clickedButton.dataset.id);
        if (isNaN(taskId)) return;

        const selectedTask = taskList.find(task => task.id === taskId);

        if (clickedButton.classList.contains("check-btn")) {
            if (selectedTask) {
                selectedTask.status = selectedTask.status === "completed" ? "pending" : "completed";
                persistTasks();
                renderTasks();
            }
            return;
        }

        if (clickedButton.classList.contains("del-btn")) {
            taskList = taskList.filter(task => task.id !== taskId);
            persistTasks();
            renderTasks();
            return;
        }

        if (clickedButton.classList.contains("edit-btn")) {
            const taskRow = clickedButton.closest("tr");
            if (!selectedTask || !taskRow) return;

            taskRow.innerHTML = `
                <td></td>
                <td>
                    <input type="text"
                        value="${selectedTask.title}"
                        class="edit-title border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                </td>
                <td>
                    <select class="edit-priority border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <option value="high" ${selectedTask.priority === "high" ? "selected" : ""}>High</option>
                        <option value="medium" ${selectedTask.priority === "medium" ? "selected" : ""}>Medium</option>
                        <option value="low" ${selectedTask.priority === "low" ? "selected" : ""}>Low</option>
                    </select>
                </td>
                <td>
                    <select class="edit-category border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <option value="work" ${selectedTask.category === "work" ? "selected" : ""}>Work</option>
                        <option value="studies" ${selectedTask.category === "studies" ? "selected" : ""}>Studies</option>
                        <option value="personal" ${selectedTask.category === "personal" ? "selected" : ""}>Personal</option>
                    </select>
                </td>
                <td></td>
                <td>
                    <button class="save-btn text-green-500" data-id="${selectedTask.id}">Save</button>
                </td>
            `;
            return;
        }

        if (clickedButton.classList.contains("save-btn")) {
            const taskRow = clickedButton.closest("tr");
            if (!selectedTask || !taskRow) return;

            const editedTitle = taskRow.querySelector(".edit-title").value.trim();
            const titleError = validateTaskTitle(editedTitle);
            if (titleError) {
                alert(titleError);
                return;
            }

            const editedPriority = taskRow.querySelector(".edit-priority").value;
            const editedCategory = taskRow.querySelector(".edit-category").value;
            const optionsError = validateTaskOptions(editedPriority, editedCategory);
            if (optionsError) {
                alert(optionsError);
                return;
            }

            selectedTask.title = editedTitle;
            selectedTask.priority = editedPriority;
            selectedTask.category = editedCategory;
            persistTasks();
            renderTasks();
        }
    });

    document.querySelectorAll(".pill").forEach(btn => {
        btn.addEventListener("click", () => {
            activeStatusFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    document.querySelectorAll("[data-priority]").forEach(btn => {
        btn.addEventListener("click", () => {
            activePriorityFilter = btn.dataset.priority;
            renderTasks();
        });
    });

    document.querySelectorAll("[data-category]").forEach(btn => {
        btn.addEventListener("click", () => {
            activeCategoryFilter = btn.dataset.category;
            renderTasks();
        });
    });

    taskSearchInput.addEventListener("input", () => {
        searchQuery = taskSearchInput.value.toLowerCase();
        renderTasks();
    });

    themeToggleButton.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
    });

    function normalizeTask(task) {
        return {
            ...task,
            status: task.status || "pending",
            priority: VALID_PRIORITIES.includes(task.priority) ? task.priority : "medium",
            category: VALID_CATEGORIES.includes(task.category) ? task.category : "personal"
        };
    }

    function loadTasks() {
        const stored = localStorage.getItem("tasks");
        if (stored) {
            taskList = JSON.parse(stored).map(normalizeTask);
        }
        renderTasks();
    }

    loadTasks();
});
