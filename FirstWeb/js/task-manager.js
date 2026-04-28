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
    const TITLE_ALLOWED_PATTERN = /^[\p{L}\p{N}\s.,:;!?()\-_'"]+$/u;
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

    /**
     * Capitalizes the first letter of a string.
     * @param {string} text - The text to capitalize.
     * @returns {string} The capitalized string.
     */
    function capitalize(text) {
        return window.TaskFlowUtils.capitalize(text);
    }

    /**
     * Escapes HTML to keep dynamic content safe inside markup.
     * @param {string} text - Raw text value.
     * @returns {string} Escaped string.
     */
    function escapeHtml(text) {
        return window.TaskFlowUtils.escapeHtml(text);
    }

    /**
     * Validates a task title based on length and allowed characters.
     * @param {string} title - The task title.
     * @returns {string} Error message or empty string if valid.
     */
    function validateTaskTitle(title) {
        return window.TaskFlowUtils.validateTaskTitle(title, {
            minLength: MIN_TITLE_LENGTH,
            maxLength: MAX_TITLE_LENGTH,
            allowedPattern: TITLE_ALLOWED_PATTERN
        });
    }

    /**
     * Validates task priority and category values.
     * @param {string} priority - Selected priority.
     * @param {string} category - Selected category.
     * @returns {string} Error message or empty string if valid.
     */
    function validateTaskOptions(priority, category) {
        return window.TaskFlowUtils.validateTaskOptions(priority, category, {
            validPriorities: VALID_PRIORITIES,
            validCategories: VALID_CATEGORIES
        });
    }

    /**
     * Normalizes a task title for comparison purposes.
     * @param {string} title - The title to normalize.
     * @returns {string} Normalized title string.
     */
    function normalizeTaskTitle(title) {
        return window.TaskFlowUtils.normalizeTaskTitle(title);
    }

    /**
     * Checks if a pending task with the same title already exists.
     * @param {string} title - Task title.
     * @param {number|null} excludeTaskId - Optional task ID to exclude from check.
     * @returns {boolean} True if duplicate exists.
     */
    function hasDuplicatePendingTitle(title, excludeTaskId = null) {
        const normalizedTitle = normalizeTaskTitle(title);
        return taskList.some(task =>
            task.id !== excludeTaskId &&
            task.status === "pending" &&
            normalizeTaskTitle(task.title) === normalizedTitle
        );
    }
    
    /**
     * Saves the current task list to localStorage.
     */
    function persistTasks() {
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    /**
     * Updates the UI counter showing completed and total tasks.
     */
    function updateTaskCounter() {
        const totalTasks = taskList.length;
        const completedTasks = taskList.filter(task => task.status === "completed").length;
        taskCounterLabel.textContent = `${completedTasks}/${totalTasks}`;
    }

    /**
     * Applies active/inactive styles to a button.
     * @param {HTMLElement} btn - Button element.
     * @param {boolean} isActive - Whether the button is active.
     */
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

    /**
     * Applies a new filter value and refreshes the task view.
     * @param {string} filterType - Filter group name.
     * @param {string} value - Selected filter value.
     */
    function setActiveFilter(filterType, value) {
        if (filterType === "status") {
            activeStatusFilter = value;
        }

        if (filterType === "priority") {
            activePriorityFilter = value;
        }

        if (filterType === "category") {
            activeCategoryFilter = value;
        }

        renderTasks();
    }

    function getTaskStatusMarkup(isDone) {
        return isDone
            ? `<span class="text-green-500 font-medium">Completed</span>`
            : `<span class="text-gray-400">Pending</span>`;
    }

    function getTaskRowMarkup(task, isDone) {
        return `
            <td class="py-2">
                <button class="check-btn text-lg ${isDone ? "text-green-500" : "text-gray-400"}" data-id="${task.id}">
                    ${isDone ? "✓" : "○"}
                </button>
            </td>
            <td class="py-2">${escapeHtml(task.title)}</td>
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
    }

    function getEditRowMarkup(task) {
        return `
            <td></td>
            <td>
                <input type="text"
                    value="${escapeHtml(task.title)}"
                    class="edit-title border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
            </td>
            <td>
                <select class="edit-priority border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="high" ${task.priority === "high" ? "selected" : ""}>High</option>
                    <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Medium</option>
                    <option value="low" ${task.priority === "low" ? "selected" : ""}>Low</option>
                </select>
            </td>
            <td>
                <select class="edit-category border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="work" ${task.category === "work" ? "selected" : ""}>Work</option>
                    <option value="studies" ${task.category === "studies" ? "selected" : ""}>Studies</option>
                    <option value="personal" ${task.category === "personal" ? "selected" : ""}>Personal</option>
                </select>
            </td>
            <td></td>
            <td>
                <button class="save-btn text-green-500" data-id="${task.id}">Save</button>
            </td>
        `;
    }

    /**
     * Finds a task by its ID.
     * @param {number} taskId - Task identifier.
     * @returns {Object|null} Matching task or null.
     */
    function getTaskById(taskId) {
        return taskList.find(task => task.id === taskId) || null;
    }

    /**
     * Persists the task list and refreshes the table UI.
     */
    function syncTaskView() {
        persistTasks();
        renderTasks();
    }

    /**
     * Toggles a task between pending and completed.
     * @param {Object} task - Task to update.
     */
    function toggleTaskStatus(task) {
        task.status = task.status === "completed" ? "pending" : "completed";
        syncTaskView();
    }

    /**
     * Removes a task from the list.
     * @param {number} taskId - Task identifier.
     */
    function deleteTask(taskId) {
        taskList = taskList.filter(task => task.id !== taskId);
        syncTaskView();
    }

    /**
     * Switches a task row into edit mode.
     * @param {HTMLElement} taskRow - Table row element.
     * @param {Object} task - Task data.
     */
    function openTaskEditor(taskRow, task) {
        taskRow.innerHTML = getEditRowMarkup(task);
    }

    /**
     * Reads edited values from a row and saves them back to a task.
     * @param {HTMLElement} taskRow - Table row element.
     * @param {Object} task - Task data.
     */
    function saveTaskEdits(taskRow, task) {
        const editedTitle = taskRow.querySelector(".edit-title").value.trim();
        const titleError = validateTaskTitle(editedTitle);
        if (titleError) {
            alert(titleError);
            return;
        }

        const editedPriority = taskRow.querySelector(".edit-priority").value;
        const editedCategory = taskRow.querySelector(".edit-category").value;
        const validationError = validateTaskData(editedTitle, editedPriority, editedCategory, task.id);
        if (validationError) {
            alert(validationError);
            return;
        }

        task.title = editedTitle;
        task.priority = editedPriority;
        task.category = editedCategory;
        syncTaskView();
    }

    /**
     * Checks whether a task matches current active filters and search query.
     * @param {Object} task - Task object.
     * @returns {boolean}
     */
    function matchesFilters(task) {
        return (
            (activeStatusFilter === "all" || task.status === activeStatusFilter) &&
            (activePriorityFilter === "all" || task.priority === activePriorityFilter) &&
            (activeCategoryFilter === "all" || task.category === activeCategoryFilter) &&
            task.title.toLowerCase().includes(searchQuery)
        );
    }

    /**
     * Renders the task list based on active filters and search query.
     */
    function renderTasks() {
        const filteredTasks = taskList.filter(matchesFilters);

        taskTableBody.innerHTML = filteredTasks
            .map(task => {
                const isDone = task.status === "completed";
                return `<tr class="border-b dark:border-gray-700">${getTaskRowMarkup(task, isDone)}</tr>`;
            })
            .join("");

        updateTaskCounter();
        updateFilterUI();
    }

    /**
     * Creates a new task object.
     * @param {string} title - Task title.
     * @returns {Object} New task object.
     */
    function createTask(title) {
        return {
            id: Date.now(),
            title,
            priority: taskPrioritySelect.value,
            category: taskCategorySelect.value,
            status: "pending"
        };
    }

    /**
     * Validates all task data including title, priority, category, and duplicates.
     * @param {string} title
     * @param {string} priority
     * @param {string} category
     * @param {number|null} excludeTaskId
     * @returns {string} Error message or empty string if valid.
     */
    function validateTaskData(title, priority, category, excludeTaskId = null) {
        const titleError = validateTaskTitle(title);
        if (titleError) return titleError;

        const optionsError = validateTaskOptions(priority, category);
        if (optionsError) return optionsError;

        if (hasDuplicatePendingTitle(title, excludeTaskId)) {
            return "A pending task with this title already exists.";
        }

        return "";
    }

    function addTask() {
        const taskTitle = taskTitleInput.value.trim();
        const validationError = validateTaskData(taskTitle, taskPrioritySelect.value, taskCategorySelect.value);
        if (validationError) {
            alert(validationError);
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

        const selectedTask = getTaskById(taskId);

        if (clickedButton.classList.contains("check-btn")) {
            if (selectedTask) toggleTaskStatus(selectedTask);
            return;
        }

        if (clickedButton.classList.contains("del-btn")) {
            deleteTask(taskId);
            return;
        }

        if (clickedButton.classList.contains("edit-btn")) {
            const taskRow = clickedButton.closest("tr");
            if (!selectedTask || !taskRow) return;
            openTaskEditor(taskRow, selectedTask);
            return;
        }

        if (clickedButton.classList.contains("save-btn")) {
            const taskRow = clickedButton.closest("tr");
            if (!selectedTask || !taskRow) return;
            saveTaskEdits(taskRow, selectedTask);
        }
    });

    document.querySelectorAll(".pill").forEach(btn => {
        btn.addEventListener("click", () => {
            setActiveFilter("status", btn.dataset.filter);
        });
    });

    document.querySelectorAll("[data-priority]").forEach(btn => {
        btn.addEventListener("click", () => {
            setActiveFilter("priority", btn.dataset.priority);
        });
    });

    document.querySelectorAll("[data-category]").forEach(btn => {
        btn.addEventListener("click", () => {
            setActiveFilter("category", btn.dataset.category);
        });
    });

    taskSearchInput.addEventListener("input", () => {
        searchQuery = taskSearchInput.value.toLowerCase();
        renderTasks();
    });

    themeToggleButton.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
    });

    /**
     * Normalizes a task loaded from storage to ensure valid structure.
     * @param {Object} task - Raw task object.
     * @returns {Object} Normalized task object.
     */
    function normalizeTask(task) {
        return window.TaskFlowUtils.normalizeTask(task, {
            validPriorities: VALID_PRIORITIES,
            validCategories: VALID_CATEGORIES,
            defaultPriority: "medium",
            defaultCategory: "personal",
            defaultStatus: "pending"
        });
    }

    /**
     * Loads tasks from localStorage and renders them.
     */
    function loadTasks() {
        const stored = localStorage.getItem("tasks");
        if (stored) {
            try {
                taskList = JSON.parse(stored).map(normalizeTask);
            } catch {
                taskList = [];
            }
        }
        renderTasks();
    }

    loadTasks();
});
