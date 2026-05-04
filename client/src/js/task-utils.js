(function (root) {
    const DEFAULT_TITLE_PATTERN = /^[\p{L}\p{N}\s.,:;!?()\-_'"]+$/u;

    function capitalize(text) {
        if (typeof text !== "string" || text.length === 0) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function normalizeTaskTitle(title) {
        return String(title)
            .trim()
            .replace(/\s+/g, " ")
            .normalize("NFKC")
            .toLowerCase();
    }

    function validateTaskTitle(title, options = {}) {
        const {
            minLength = 3,
            maxLength = 100,
            allowedPattern = DEFAULT_TITLE_PATTERN
        } = options;

        if (!title) {
            return "Task title is required.";
        }

        if (title.length < minLength) {
            return `Task title must be at least ${minLength} characters long.`;
        }

        if (title.length > maxLength) {
            return `Task title must be ${maxLength} characters or less.`;
        }

        if (!allowedPattern.test(title)) {
            return "Task title contains invalid characters.";
        }

        return "";
    }

    function validateTaskOptions(priority, category, options = {}) {
        const {
            validPriorities = ["high", "medium", "low"],
            validCategories = ["work", "studies", "personal"]
        } = options;

        if (!validPriorities.includes(priority)) {
            return "Invalid priority selected.";
        }

        if (!validCategories.includes(category)) {
            return "Invalid category selected.";
        }

        return "";
    }

    function normalizeTask(task, options = {}) {
        const {
            validPriorities = ["high", "medium", "low"],
            validCategories = ["work", "studies", "personal"],
            defaultPriority = "medium",
            defaultCategory = "personal",
            defaultStatus = "pending"
        } = options;

        return {
            ...task,
            status: task.status || defaultStatus,
            priority: validPriorities.includes(task.priority) ? task.priority : defaultPriority,
            category: validCategories.includes(task.category) ? task.category : defaultCategory
        };
    }

    const api = {
        capitalize,
        escapeHtml,
        normalizeTaskTitle,
        validateTaskTitle,
        validateTaskOptions,
        normalizeTask
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }

    root.TaskFlowUtils = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
