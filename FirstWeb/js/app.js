document.addEventListener("DOMContentLoaded", () => {

    const taskBody = document.getElementById("taskBody");
    const taskInput = document.getElementById("taskInput");
    const prioritySelect = document.getElementById("prioritySelect");
    const categorySelect = document.getElementById("categorySelect");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const searchInput = document.getElementById("searchInput");
    const taskCounter = document.getElementById("taskCounter");
    const darkToggle = document.getElementById("darkToggle");

    let tasks = [];
    let activeFilter = "all";
    let activePriority = "all";
    let activeCategory = "all";
    let searchText = "";

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

    function updateFilterUI() {

        document.querySelectorAll(".pill").forEach(btn => {
            const active = btn.dataset.filter === activeFilter;

            btn.classList.toggle("bg-blue-500", active);
            btn.classList.toggle("text-white", active);

            btn.classList.toggle("bg-gray-200", !active);
            btn.classList.toggle("dark:bg-gray-700", !active);
        });

        document.querySelectorAll("[data-priority]").forEach(btn => {
            const active = btn.dataset.priority === activePriority;

            btn.classList.toggle("bg-blue-500", active);
            btn.classList.toggle("text-white", active);

            btn.classList.toggle("bg-gray-200", !active);
            btn.classList.toggle("dark:bg-gray-700", !active);
        });

        document.querySelectorAll("[data-category]").forEach(btn => {
            const active = btn.dataset.category === activeCategory;

            btn.classList.toggle("bg-blue-500", active);
            btn.classList.toggle("text-white", active);

            btn.classList.toggle("bg-gray-200", !active);
            btn.classList.toggle("dark:bg-gray-700", !active);
        });
    }

    function capitalize(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
    }

    function persistTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function updateCounter() {
        const completed = tasks.filter(t => t.status === "completed").length;
        taskCounter.textContent = `${completed}/${tasks.length}`;
    }

    function renderTasks() {

        taskBody.innerHTML = "";

        const filtered = tasks.filter(task =>
            (activeFilter === "all" || task.status === activeFilter) &&
            (activePriority === "all" || task.priority === activePriority) &&
            (activeCategory === "all" || task.category === activeCategory) &&
            task.title.toLowerCase().includes(searchText)
        );

        filtered.forEach(task => {

            const isDone = task.status === "completed";

            const tr = document.createElement("tr");
            tr.className = "border-b dark:border-gray-700";

            tr.innerHTML = `
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

                <td class="py-2">
                    ${isDone
                        ? `<span class="text-green-500 font-medium">Completed</span>`
                        : `<span class="text-gray-400">Pending</span>`}
                </td>

                <td class="py-2 flex gap-2">
                    <button class="edit-btn text-blue-500" data-id="${task.id}">Edit</button>
                    <button class="del-btn text-red-500" data-id="${task.id}">✕</button>
                </td>
            `;

            taskBody.appendChild(tr);
        });

        updateCounter();
        updateFilterUI();
    }


    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        tasks.push({
            id: Date.now(),
            title: text,
            priority: prioritySelect.value,
            category: categorySelect.value,
            status: "pending"
        });

        taskInput.value = "";
        persistTasks();
        renderTasks();
    }

    addTaskBtn.addEventListener("click", addTask);

    taskInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTask();
        }
    });

    taskBody.addEventListener("click", e => {

        const btn = e.target.closest("button");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        if (isNaN(id)) return;

        const task = tasks.find(t => t.id === id);

        if (btn.classList.contains("check-btn")) {
            if (task) {
                task.status = task.status === "completed" ? "pending" : "completed";
                persistTasks();
                renderTasks();
            }
            return;
        }

        if (btn.classList.contains("del-btn")) {
            tasks = tasks.filter(t => t.id !== id);
            persistTasks();
            renderTasks();
            return;
        }

        if (btn.classList.contains("edit-btn")) {

            const tr = btn.closest("tr");
            if (!task || !tr) return;

            tr.innerHTML = `
                <td></td>

                <td>
                    <input type="text"
                        value="${task.title}"
                        class="edit-title border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
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

            return;
        }

        if (btn.classList.contains("save-btn")) {

            const tr = btn.closest("tr");
            if (!task || !tr) return;

            task.title = tr.querySelector(".edit-title").value.trim();
            task.priority = tr.querySelector(".edit-priority").value;
            task.category = tr.querySelector(".edit-category").value;

            persistTasks();
            renderTasks();
            return;
        }
    });

    document.querySelectorAll(".pill").forEach(btn => {
        btn.addEventListener("click", () => {
            activeFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    document.querySelectorAll("[data-priority]").forEach(btn => {
        btn.addEventListener("click", () => {
            activePriority = btn.dataset.priority;
            renderTasks();
        });
    });

    document.querySelectorAll("[data-category]").forEach(btn => {
        btn.addEventListener("click", () => {
            activeCategory = btn.dataset.category;
            renderTasks();
        });
    });

    searchInput.addEventListener("input", () => {
        searchText = searchInput.value.toLowerCase();
        renderTasks();
    });

    darkToggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
    });

    function loadTasks() {
        const stored = localStorage.getItem("tasks");
        if (stored) {
            tasks = JSON.parse(stored).map(t => ({
                ...t,
                status: t.status || "pending"
            }));
        }
        renderTasks();
    }

    loadTasks();
});