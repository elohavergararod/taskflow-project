# TaskFlow Task Manager Module

## Purpose

`FirstWeb/js/task-manager.js` powers the main task management experience in TaskFlow.
It handles task creation, editing, completion, deletion, filtering, searching, theme toggling, and persistence in `localStorage`.

## Inputs

- user text from `#taskInput`
- selected priority from `#prioritySelect`
- selected category from `#categorySelect`
- filter clicks from the status, priority, and category controls
- search text from `#searchInput`
- stored data from `localStorage`

## Outputs

- task rows rendered in `#taskBody`
- counter updates in `#taskCounter`
- updated stored task data in `localStorage`
- visible UI changes for filters, editing, and theme mode

## Main Functions

- `addTask()` creates a task from the form inputs and saves it.
- `renderTasks()` rebuilds the table based on filters and search.
- `validateTaskData()` checks task title, priority, category, and duplicates.
- `persistTasks()` stores the current task list.
- `loadTasks()` restores data from `localStorage`.
- `normalizeTask()` repairs stored records that are missing valid defaults.

## Dependencies

- `FirstWeb/index.html` for the DOM structure
- `FirstWeb/css/FirstWeb.css` and Tailwind utility classes for styling
- `FirstWeb/js/task-utils.js` for shared helper functions
- browser `localStorage` for persistence

## Usage

The module runs automatically after the page loads.
It reads the existing DOM, wires event listeners, loads saved tasks, and keeps the interface in sync with the current task list.

## Notes

- Task titles are validated before being saved.
- Duplicate pending tasks are blocked.
- Edit mode is handled inline inside the table.
- The module uses delegated events for task actions, which keeps the table easy to refresh.
