import { TaskState } from "./task-state.js";
import { TaskService } from "./task-service.js";
import {
    validateTaskTitle,
    validateTaskOptions,
    normalizeTaskTitle
} from "./task-utils.js";
import { renderTasks } from "./task-render.js";

document.addEventListener("DOMContentLoaded", () => {

    const tableBody = document.getElementById("taskBody");
    const input = document.getElementById("taskInput");
    const priority = document.getElementById("prioritySelect");
    const category = document.getElementById("categorySelect");
    const addBtn = document.getElementById("addTaskBtn");
    const themeToggleButton = document.getElementById("darkToggle");
    const taskSearchInput = document.getElementById("searchInput");
    const sortToggleButton = document.getElementById("sortToggleBtn");
    const taskCounterLabel = document.getElementById("taskCounter");

    const TITLE_OPTIONS = {
        minLength: 3,
        maxLength: 100,
        allowedPattern: /^[\p{L}\p{N}\s.,:;!?()\-_'"]+$/u
    };

    const OPTIONS_CONFIG = {
        validPriorities: ["high", "medium", "low"],
        validCategories: ["work", "studies", "personal"]
    };

    function updateTaskCounter() {
        const total = TaskState.tasks.length;
        const completed = TaskState.tasks.filter(t => t.status === "completed").length;
        taskCounterLabel.textContent = `${completed}/${total}`;
    }

    function updateFilterUI() {
        document.querySelectorAll("[data-filter-type]").forEach(btn => {
            const type = btn.dataset.filterType;
            const value = btn.dataset.filter;
            const isActive = TaskState.filters[type] === value;
            btn.classList.toggle("bg-blue-500", isActive);
            btn.classList.toggle("text-white", isActive);
            btn.classList.toggle("bg-gray-200", !isActive);
            btn.classList.toggle("dark:bg-gray-700", !isActive);
        });
    }

    async function loadTasks() {
        TaskState.tasks = await TaskService.getAll();
        renderTasks(TaskState.tasks, tableBody, TaskState);
        updateTaskCounter();
        updateFilterUI();
    }

    // Comprueba si ya existe una tarea PENDING con ese título (excluyendo un id)
    function hasDuplicatePending(title, excludeId = null) {
        const normalized = normalizeTaskTitle(title);
        return TaskState.tasks.some(t =>
            t.id !== excludeId &&
            t.status === "pending" &&
            normalizeTaskTitle(t.title) === normalized
        );
    }

    function validate(title, prio, cat, excludeId = null) {
        const titleError = validateTaskTitle(title, TITLE_OPTIONS);
        if (titleError) return titleError;

        const optionsError = validateTaskOptions(prio, cat, OPTIONS_CONFIG);
        if (optionsError) return optionsError;

        if (hasDuplicatePending(title, excludeId)) {
            return "Ya existe una tarea pendiente con ese nombre.";
        }

        return "";
    }

    async function addTask() {
        const title = input.value.trim();
        const error = validate(title, priority.value, category.value);
        if (error) return alert(error);

        const newTask = await TaskService.create({
            title,
            priority: priority.value,
            category: category.value,
            status: "pending"
        });

        TaskState.tasks.push(newTask);
        renderTasks(TaskState.tasks, tableBody, TaskState);
        updateTaskCounter();
        input.value = "";
    }

    async function deleteTask(id) {
        await TaskService.delete(id);
        TaskState.tasks = TaskState.tasks.filter(t => t.id !== id);
        renderTasks(TaskState.tasks, tableBody, TaskState);
        updateTaskCounter();
    }

    function toggleTask(id) {
        const task = TaskState.tasks.find(t => t.id === id);
        if (!task) return;

        // Si va a volver a pending, comprobar que no haya ya otra pending igual
        if (task.status === "completed" && hasDuplicatePending(task.title, task.id)) {
            alert(`Ya existe una tarea pendiente con el nombre "${task.title}". Renómbrala antes de reactivarla.`);
            return;
        }

        task.status = task.status === "completed" ? "pending" : "completed";
        renderTasks(TaskState.tasks, tableBody, TaskState);
        updateTaskCounter();
    }

    function enterEditMode(row, task) {
        row.innerHTML = `
            <td></td>
            <td class="py-2">
                <input type="text" value="${task.title}"
                    class="edit-title border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
            </td>
            <td class="py-2">
                <select class="edit-priority border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="high"   ${task.priority === "high"   ? "selected" : ""}>High</option>
                    <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Medium</option>
                    <option value="low"    ${task.priority === "low"    ? "selected" : ""}>Low</option>
                </select>
            </td>
            <td class="py-2">
                <select class="edit-category border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="work"     ${task.category === "work"     ? "selected" : ""}>Work</option>
                    <option value="studies"  ${task.category === "studies"  ? "selected" : ""}>Studies</option>
                    <option value="personal" ${task.category === "personal" ? "selected" : ""}>Personal</option>
                </select>
            </td>
            <td></td>
            <td class="py-2">
                <div class="flex flex-wrap gap-2 items-center">
                    <button class="save-btn text-green-500" data-id="${task.id}">Save</button>
                    <button class="cancel-btn text-gray-500" data-id="${task.id}">Cancel</button>
                </div>
                <p class="edit-error text-red-500 text-xs mt-1 hidden"></p>
            </td>
        `;
    }

    function setEditRowError(row, message) {
        const el = row.querySelector(".edit-error");
        if (!el) return;
        el.textContent = message;
        el.classList.toggle("hidden", !message);
    }

    function saveEdit(row, task) {
        const titleInput = row.querySelector(".edit-title");
        const newTitle = titleInput.value.trim();
        const newPriority = row.querySelector(".edit-priority").value;
        const newCategory = row.querySelector(".edit-category").value;

        const error = validate(newTitle, newPriority, newCategory, task.id);
        if (error) {
            setEditRowError(row, error);
            titleInput.focus();
            return;
        }

        setEditRowError(row, "");
        task.title = newTitle;
        task.priority = newPriority;
        task.category = newCategory;

        renderTasks(TaskState.tasks, tableBody, TaskState);
        updateTaskCounter();
    }

    document.querySelectorAll("[data-filter-type]").forEach(btn => {
        btn.addEventListener("click", () => {
            TaskState.filters[btn.dataset.filterType] = btn.dataset.filter;
            renderTasks(TaskState.tasks, tableBody, TaskState);
            updateFilterUI();
        });
    });

    themeToggleButton.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
    });

    taskSearchInput.addEventListener("input", (e) => {
        TaskState.search = e.target.value.toLowerCase();
        renderTasks(TaskState.tasks, tableBody, TaskState);
    });

    sortToggleButton.addEventListener("click", () => {
        TaskState.sort = TaskState.sort === "asc" ? "desc" : "asc";
        sortToggleButton.textContent = TaskState.sort === "asc" ? "A → Z" : "Z → A";
        renderTasks(TaskState.tasks, tableBody, TaskState);
    });

    tableBody.addEventListener("keydown", (e) => {
        const row = e.target.closest("tr");
        if (!row || !row.querySelector(".edit-title")) return;

        if (e.key === "Enter") {
            e.preventDefault();
            const saveBtn = row.querySelector(".save-btn");
            const id = Number(saveBtn?.dataset.id);
            const task = TaskState.tasks.find(t => t.id === id);
            if (task) saveEdit(row, task);
        }

        if (e.key === "Escape") {
            renderTasks(TaskState.tasks, tableBody, TaskState);
        }
    });

    tableBody.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const task = TaskState.tasks.find(t => t.id === id);

        if (btn.classList.contains("del-btn"))   { deleteTask(id); return; }
        if (btn.classList.contains("check-btn")) { toggleTask(id); return; }

        if (btn.classList.contains("edit-btn")) {
            if (task) enterEditMode(btn.closest("tr"), task);
            return;
        }

        if (btn.classList.contains("save-btn")) {
            if (task) saveEdit(btn.closest("tr"), task);
            return;
        }

        if (btn.classList.contains("cancel-btn")) {
            renderTasks(TaskState.tasks, tableBody, TaskState);
        }
    });

    addBtn.addEventListener("click", addTask);

    loadTasks();
});