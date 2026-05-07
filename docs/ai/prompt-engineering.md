# Prompt Engineering for Software Development

## Purpose

This document collects reusable prompts for working with AI during software development.
The prompts below are already adapted to TaskFlow, the task manager in this project.
They are designed to help with:

- generating code
- refactoring functions
- documenting the project
- reviewing code
- creating tests

Each prompt includes a short explanation of why it works well, so it can be reused later with more confidence.

## How to Use These Prompts

- Copy the prompt you need and send it as-is or with a small code snippet attached.
- Paste the related function, such as `addTask`, `renderTasks`, `validateTaskData`, or `persistTasks`.
- Keep the instruction focused on one task at a time.
- Reuse the prompts whenever you want similar results in TaskFlow.

## Useful Prompts

### 1. Role-Based Prompt for Code Generation

**Prompt**

```text
Act as a senior software developer.
Analyze this requirement in the context of TaskFlow, the task manager app in this project.
Propose a clear, maintainable, and scalable solution.
Before writing code, explain the strategy.
Then provide the final code ready to integrate.

Requirement: Add a new task feature that fits the existing task table, filters, and localStorage workflow.
Project context: TaskFlow is a vanilla JavaScript app with `task-manager.js`, `FirstWeb/index.html`, and `FirstWeb/css/FirstWeb.css`.
```

**Why it works**

Giving the model a role sets the expected level of depth and quality.
It usually produces more structured answers and better engineering decisions.

### 2. Prompt for Generating Code with Constraints

**Prompt**

```text
Write code for this feature in TaskFlow:
Add a task-related improvement that works with the existing DOM structure, filters, and `localStorage` persistence.

Follow these rules:
- do not break existing behavior
- reuse existing functions when possible
- return only the necessary code
- keep the code consistent with `task-manager.js`
- if information is missing, say exactly what you need
```

**Why it works**

Clear constraints reduce ambiguity and guide the model toward practical solutions.
This is useful when you want code that fits the current project instead of a generic answer.

### 3. Few-Shot Prompt for Creating Functions

**Prompt**

```text
Follow this pattern for writing functions in TaskFlow.

Example 1:
Input: the current `taskList` array
Expected output: a function that counts completed tasks and updates `taskCounter`

Example 2:
Input: a list of tasks with filters
Expected output: a function that returns only the tasks matching status, priority, category, and search text

Now apply the same style to this task:
Create a function that helps TaskFlow render or filter tasks more cleanly.
```

**Why it works**

Few-shot prompting gives the model concrete examples of the format and style you want.
That improves consistency and reduces vague or off-target responses.

### 4. Prompt for Refactoring a Function

**Prompt**

```text
Refactor this TaskFlow function to improve readability and maintainability.
Do not change its behavior.
Do not change the function signature unless it is absolutely necessary.
Briefly explain what you improved and why.

Code:
`addTask`, `renderTasks`, `validateTaskData`, or `persistTasks`
```

**Why it works**

The prompt defines the goal and the limits very clearly.
That helps prevent unnecessary changes and keeps the refactor safe and focused.

### 5. Step-by-Step Debugging Prompt

**Prompt**

```text
Analyze this TaskFlow bug step by step.
1. Identify the most likely cause.
2. Explain why it happens.
3. Propose a fix.
4. Explain how to verify that the fix works.

Observed error or behavior:
Example: a task is not saved to `localStorage`, the counter is wrong, or the filter buttons do not update correctly.

Related code:
`FirstWeb/js/task-manager.js`
```

**Why it works**

Requesting a step-by-step structure encourages a more complete analysis.
It also helps the model justify the fix instead of jumping straight to a guess.

### 6. Prompt for Project Documentation

**Prompt**

```text
Write technical documentation for the TaskFlow task manager component.
I need a short, clear explanation aimed at developers.
Include:
- the purpose of the component
- inputs and outputs
- important dependencies
- possible use cases

Component:
TaskFlow task management UI and logic
Code:
`FirstWeb/index.html`, `FirstWeb/css/FirstWeb.css`, and `FirstWeb/js/task-manager.js`
```

**Why it works**

This prompt gives a documentation structure that is easy to reuse later.
It is especially useful for README files, internal docs, and developer onboarding.

### 7. Code Review Prompt

**Prompt**

```text
Review this TaskFlow code as if you were doing a code review.
Look for:
- logic bugs
- edge cases
- performance issues
- maintainability risks

Return the most important issues first, then suggest improvements.

Code:
`FirstWeb/js/task-manager.js`
```

**Why it works**

The model gets a clear review checklist, which makes the feedback more useful.
It also helps prioritize the highest-impact problems first.

### 8. Prompt for Generating Tests

**Prompt**

```text
Generate tests for this TaskFlow function.
Include normal cases, edge cases, and at least one error case.
Keep the testing style consistent with the project.
If you notice a missing validation in the function, mention it.

Function:
`validateTaskData`, `validateTaskTitle`, or `normalizeTask`
```

**Why it works**

This prompt pushes the model to cover real behavior instead of only the happy path.
It also helps catch missing validations before the tests are written.

### 9. Prompt for Summarizing a Module

**Prompt**

```text
Summarize this TaskFlow module in clear language for internal documentation.
I want to know:
- what it does
- how to use it
- what important parts it contains
- which external dependencies it uses

Do not repeat the code literally. Explain it in your own words.

Module:
`FirstWeb/js/task-manager.js`
```

**Why it works**

The prompt asks for a concise explanation instead of a literal copy of the code.
That makes the output more useful for documentation and team knowledge sharing.

### 10. Prompt for Improving an Existing Function

**Prompt**

```text
Take this TaskFlow function and propose an improved version.
Goals:
- lower complexity
- clearer names
- better separation of responsibilities
- same output for the same input

First explain the changes, then show the final code.

Current function:
`createTask`, `matchesFilters`, or `updateFilterUI`
```

**Why it works**

The prompt balances improvement goals with behavior stability.
That makes it easier to get a cleaner implementation without introducing regressions.

## Reusable Prompt Templates

### Code Generation Template

```text
Act as a senior software developer working on TaskFlow.
Build a feature for the existing vanilla JavaScript task manager.
Use HTML, CSS, and JavaScript only.
Constraints:
- keep the current table-based layout
- preserve `localStorage` persistence
- keep the filter and search behavior working
- match the style used in `FirstWeb/css/FirstWeb.css`

If needed, ask for missing context before coding.
```

### Refactoring Template

```text
Refactor this TaskFlow code to improve readability and maintainability.
Do not change behavior.
Keep the public API stable if possible.
Explain the main changes briefly.

Code:
`FirstWeb/js/task-manager.js`
```

### Documentation Template

```text
Write developer documentation for the TaskFlow task manager module.
Include:
- purpose
- inputs and outputs
- dependencies
- usage examples

Use concise, clear language.
```

## Best Practices

- Add context before asking for a solution.
- Use examples when you want a specific output format.
- Add constraints when behavior must stay the same.
- Split large tasks into smaller prompts when needed.
- Reuse these templates later by replacing the placeholders.

## Conclusion

These prompts work well because they combine four useful ideas:

- a clear role
- concrete examples
- step-by-step guidance
- explicit constraints

That makes them practical for generating code, refactoring functions, and documenting a project in a way you can reuse later.
