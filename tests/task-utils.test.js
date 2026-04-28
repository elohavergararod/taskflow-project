const assert = require("node:assert/strict");

const {
    capitalize,
    escapeHtml,
    normalizeTaskTitle,
    validateTaskTitle,
    validateTaskOptions,
    normalizeTask
} = require("../FirstWeb/js/task-utils");

const tests = [
    ["capitalize returns the first letter in uppercase", () => {
        assert.equal(capitalize("taskFlow"), "TaskFlow");
    }],
    ["escapeHtml protects unsafe markup characters", () => {
        assert.equal(escapeHtml('<script>alert("x")</script>'), "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    }],
    ["normalizeTaskTitle trims and collapses whitespace", () => {
        assert.equal(normalizeTaskTitle("  Task   Title  "), "task title");
    }],
    ["validateTaskTitle accepts a valid title", () => {
        assert.equal(validateTaskTitle("Write docs"), "");
    }],
    ["validateTaskTitle rejects short titles", () => {
        assert.equal(validateTaskTitle("No"), "Task title must be at least 3 characters long.");
    }],
    ["validateTaskOptions accepts valid values", () => {
        assert.equal(validateTaskOptions("high", "work"), "");
    }],
    ["validateTaskOptions rejects invalid values", () => {
        assert.equal(validateTaskOptions("urgent", "work"), "Invalid priority selected.");
    }],
    ["normalizeTask fills missing values with defaults", () => {
        const task = normalizeTask({ id: 1, title: "Demo", priority: "invalid", category: "other" });

        assert.deepEqual(task, {
            id: 1,
            title: "Demo",
            priority: "medium",
            category: "personal",
            status: "pending"
        });
    }]
];

let failed = 0;

for (const [name, fn] of tests) {
    try {
        fn();
        console.log(`PASS ${name}`);
    } catch (error) {
        failed += 1;
        console.error(`FAIL ${name}`);
        console.error(error);
    }
}

if (failed > 0) {
    process.exitCode = 1;
    console.error(`${failed} test(s) failed.`);
} else {
    console.log(`${tests.length} test(s) passed.`);
}
