import { capitalize, escapeHtml } from "./task-utils.js";

const PRIORITY_BADGES = {
    high:   "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs font-medium",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs font-medium",
    low:    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-medium"
};

const CATEGORY_BADGES = {
    work:     "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium",
    studies:  "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded text-xs font-medium",
    personal: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 px-2 py-1 rounded text-xs font-medium"
};

const DONE_BADGE = "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 px-2 py-1 rounded text-xs font-medium";

export function renderTasks(tasks, tableBody, state) {

    const filtered = tasks
        .filter(task => {
            const matchStatus =
                state.filters.status === "all" ||
                task.status === state.filters.status;

            const matchPriority =
                state.filters.priority === "all" ||
                task.priority === state.filters.priority;

            const matchCategory =
                state.filters.category === "all" ||
                task.category === state.filters.category;

            const matchSearch =
                `${task.title} ${task.priority} ${task.category}`
                    .toLowerCase()
                    .includes(state.search);

            return matchStatus && matchPriority && matchCategory && matchSearch;
        })
        .sort((a, b) =>
            state.sort === "asc"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
        );

    if (!filtered.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No tasks match current filters or search.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = filtered.map(task => {
        const isDone = task.status === "completed";

        const checkBtn = `<button class="check-btn text-lg ${isDone ? "text-green-500" : "text-gray-400"}" data-id="${task.id}">${isDone ? "✓" : "○"}</button>`;
        const titleCell = `<td class="py-2 ${isDone ? "line-through text-gray-400 dark:text-gray-500" : ""}">${escapeHtml(task.title)}</td>`;
        const priorityCell = `<td class="py-2"><span class="${isDone ? DONE_BADGE : PRIORITY_BADGES[task.priority]}">${capitalize(task.priority)}</span></td>`;
        const categoryCell = `<td class="py-2"><span class="${isDone ? DONE_BADGE : CATEGORY_BADGES[task.category]}">${capitalize(task.category)}</span></td>`;
        const statusCell = isDone
            ? `<td class="py-2 text-xs"><span class="text-green-500 font-medium">Completed</span></td>`
            : `<td class="py-2 text-xs"><span class="text-gray-400">Pending</span></td>`;
        const actionsCell = `
            <td class="py-2 flex gap-2">
                <button class="edit-btn text-blue-500 hover:text-blue-600" data-id="${task.id}">Edit</button>
                <button class="del-btn text-red-500 hover:text-red-600" data-id="${task.id}">✕</button>
            </td>`;

        return `
            <tr class="border-b dark:border-gray-700">
                <td class="py-2">${checkBtn}</td>
                ${titleCell}
                ${priorityCell}
                ${categoryCell}
                ${statusCell}
                ${actionsCell}
            </tr>
        `;
    }).join("");
}
