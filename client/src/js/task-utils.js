const DEFAULT_TITLE_PATTERN = /^[\p{L}\p{N}\s.,:;!?()\-_'"]+$/u;

export function capitalize(text) {
    if (typeof text !== "string" || text.length === 0) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function normalizeTaskTitle(title) {
    return String(title)
        .trim()
        .replace(/\s+/g, " ")
        .normalize("NFKC")
        .toLowerCase();
}

export function validateTaskTitle(title, options = {}) {
    const {
        minLength = 3,
        maxLength = 100,
        allowedPattern = DEFAULT_TITLE_PATTERN
    } = options;

    if (!title) return "Task title is required.";
    if (title.length < minLength) return `Min ${minLength} chars.`;
    if (title.length > maxLength) return `Max ${maxLength} chars.`;
    if (!allowedPattern.test(title)) return "Invalid characters.";

    return "";
}

export function validateTaskOptions(priority, category, options = {}) {
    const {
        validPriorities = ["high", "medium", "low"],
        validCategories = ["work", "studies", "personal"]
    } = options;

    if (!validPriorities.includes(priority)) return "Invalid priority";
    if (!validCategories.includes(category)) return "Invalid category";

    return "";
}

export function normalizeTask(task, options = {}) {
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
        priority: validPriorities.includes(task.priority)
            ? task.priority
            : defaultPriority,
        category: validCategories.includes(task.category)
            ? task.category
            : defaultCategory
    };
}