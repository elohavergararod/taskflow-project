# Cursor AI Workflow Documentation

## Purpose of This Document

This document describes my experience integrating Cursor into the TaskFlow development workflow.

It includes:
- Installation and setup process  
- Exploration of the interface and features  
- Use of AI-assisted editing tools  
- Refactoring examples  
- Keyboard shortcuts used frequently  
- Observations on productivity improvements  
- MCP installation

---

## Installation and Setup

1. Ensure you have the Cursor extension installed in VS Code.
2. Open your TaskFlow project folder.
3. Verify the Cursor extension is active and accessible from the sidebar or via  
   `Ctrl + Shift + P` → `Cursor: Open`.

---

## Exploration of Interface and Features

- **File Explorer:** Navigate through project files.
- **Integrated Terminal:** Run commands such as `npm install`.
- **Cursor Chat:** Select code and request explanations or improvements.
- **Editing Tools:** Inline edits, autocompletion, and Composer for multi-file changes.

---

## AI-Assisted Editing

### Autocompletion

I added a comment asking Cursor to create a function that updates a task counter.

Cursor generated a function that calculates total and completed tasks using `filter()`.

This feature improved user feedback and required minimal manual coding.

---

### Contextual Chat

I selected the `createTaskElement` function and asked Cursor to explain what it does.

Cursor provided a step-by-step explanation of:
- How DOM elements are created
- How event listeners are attached
- How localStorage is updated

This helped me better understand the internal logic and data flow of the application.

---

### Inline Editing

I selected the `createTaskElement` function and asked Cursor to remove the `confirm()` dialog and improve the task handling logic.

Cursor generated a cleaner version of the function by separating task completion and deletion logic.

This improved:
- Code readability  
- Separation of responsibilities  
- Maintainability  

---

### Multi-file Refactor

I used Cursor to rename the `saveTasks` function to `persistTasks` across the project to keep naming consistent.

Cursor analyzed the files and generated a preview of all changes before applying them.

All references to `saveTasks()` were automatically updated to `persistTasks()`, reducing the risk of manual refactoring errors.

---

## Frequently Used Keyboard Shortcuts

- `Ctrl + Shift + P` → Open Command Palette  
- `Tab` → Accept AI suggestion  
- `Ctrl + Enter` → Send selected code to Cursor Chat  
- `Alt + Shift + Down` → Add cursor below  
- `Ctrl + D` → Select next occurrence  

---

## Concrete Improvements Made by Cursor

### 1. Task Counter Function  
Cursor generated a function that calculates total and completed tasks using `filter()`.  
This saved development time and avoided manual implementation mistakes.

### 2. Task Handling Refactor  
Cursor helped restructure the task element logic by separating deletion and completion actions.  
This made the code clearer, more modular, and easier to maintain.

---

## MCP Installation

MCP (Model Context Protocol) is an open standard that allows AI assistants like Cursor to connect to external tools, services, and data sources through a unified interface.

### Prerequisites

- Node.js v18 or higher installed on your system
- Cursor IDE (version 0.40 or above)
- A terminal / command-line interface

### Step-by-Step Installation

**Step 1 — Open Cursor Settings**

Open the Command Palette with `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS) and search for **Cursor Settings**, or navigate to `File → Preferences → Cursor Settings`.

**Step 2 — Locate the MCP Section**

Inside Cursor Settings, find the **MCP** tab or scroll to the **Model Context Protocol** section. This is where all MCP server configurations are managed.

**Step 3 — Add an MCP Server**

Click **Add new MCP server**. You will be prompted to provide:

- **Name** — a label to identify the server (e.g., `filesystem`, `github`, `postgres`)
- **Command** — the command used to launch the server (e.g., `npx`)
- **Arguments** — any arguments the command requires (e.g., `-y @modelcontextprotocol/server-filesystem /path/to/folder`)

**Example — Filesystem MCP Server:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
    }
  }
}
```

**Step 4 — Install the Server Package (if needed)**

Some MCP servers require a global or local npm package. Open the integrated terminal and run:

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

Replace the package name with the one matching your desired server (e.g., `@modelcontextprotocol/server-github`, `@modelcontextprotocol/server-postgres`).

**Step 5 — Verify the Connection**

After saving the configuration, return to the MCP section in Cursor Settings. A green indicator next to the server name confirms it is running and connected. If the server fails to connect, check the terminal output for error messages related to missing dependencies or incorrect paths.

**Step 6 — Use MCP in Cursor Chat**

Once connected, MCP tools become available automatically in Cursor's AI Chat. You can reference them naturally in your prompts, for example:

> "Read the contents of `tasks.json` and suggest improvements."  
> "List all open issues in the repository."

---

## When MCP Is Useful in Real Projects

MCP is most valuable when your AI assistant needs to interact with live data or external systems rather than just the code files open in the editor. The following are common scenarios where MCP provides a meaningful advantage.

### 1. Working with the Local Filesystem

When your project references configuration files, data files, or assets stored outside the current editor workspace, the Filesystem MCP server allows Cursor to read and reason about those files directly. This is useful for projects that load environment-specific configs at runtime or process data files that are not tracked in the repository.

### 2. Querying a Database

With a database MCP server (e.g., PostgreSQL or SQLite), Cursor can inspect your actual schema, run sample queries, and help you write accurate SQL or ORM calls. This eliminates the need to manually paste schema definitions into the chat and reduces errors caused by outdated or incomplete context.

### 3. Interacting with GitHub or GitLab

A version-control MCP server lets Cursor read open issues, pull request descriptions, and commit history. This is particularly useful when writing commit messages, generating changelogs, or when you want the AI to understand the broader context of a feature before suggesting changes.

### 4. Fetching Live API Data

When building integrations or testing third-party APIs, an HTTP or REST MCP server allows Cursor to make real requests and inspect actual responses. This makes it easier to validate request shapes, debug authentication errors, and document endpoints based on live data.

### 5. Reading Documentation or Knowledge Bases

An MCP server connected to internal documentation (Notion, Confluence, local markdown files) allows Cursor to answer questions grounded in your team's actual standards and conventions, rather than relying solely on general training data.

### 6. Automating Repetitive Dev Tasks

MCP servers can expose custom scripts or shell commands as tools. This enables Cursor to trigger builds, run test suites, or execute migration scripts as part of a conversational workflow, reducing context switching between the editor and the terminal.

---

## Observations on Productivity Improvements

Using Cursor reduced development time when adding the task counter feature and refactoring the task handling logic.

Instead of manually rewriting functions, I was able to generate and apply improvements in seconds.

Autocompletion helped generate functional code quickly, while inline editing improved structure and clarity.

Overall, Cursor made the workflow more efficient and reduced the likelihood of introducing errors during refactoring.
