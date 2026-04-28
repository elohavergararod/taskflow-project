# AI Programming Experiments

## Purpose

This document compares programming tasks solved without AI and then with AI assistance.
The goal is to measure how AI affects:

- time spent
- code quality
- understanding of the problem
- confidence when applying the solution later

The experiment is split into two parts:

1. three small programming problems
2. three tasks related to TaskFlow

## Method

For each task, I followed the same process:

1. solve it manually first
2. note the time spent and any difficulties
3. ask AI for help on the same task
4. compare the result
5. evaluate the final code or explanation

## Part 1: Small Programming Problems

### 1. Count completed items in an array

**Problem**

Given an array of objects, count how many items have `status: "completed"`.

**Without AI**

- Time spent: 8 minutes
- Approach: used a `for` loop and a counter variable
- Result: correct, but a little verbose
- Understanding: high, because the logic was written from scratch

**With AI**

- Time spent: 3 minutes
- Approach: asked for a concise solution using array methods
- Result: shorter code using `filter()` and `length`
- Understanding: medium, because the answer was faster but still easy to read

**Comparison**

- Quality improved because the AI version was shorter and more idiomatic
- Time decreased noticeably
- Manual solving gave a deeper mental model of the logic

### 2. Remove duplicate strings while keeping order

**Problem**

Receive an array of strings and return a new array without duplicates, preserving the original order.

**Without AI**

- Time spent: 12 minutes
- Approach: used a loop with a `Set` and a result array
- Result: correct and easy to reason about
- Understanding: high, because I had to decide the data structure myself

**With AI**

- Time spent: 4 minutes
- Approach: asked for a clean solution and a short explanation
- Result: same behavior, with a simpler implementation
- Understanding: medium-high, because the explanation clarified why `Set` works well here

**Comparison**

- The AI solution was faster and cleaner
- The manual solution helped me understand the tradeoff between simplicity and control
- For this kind of task, AI is especially useful when the goal is to reduce boilerplate

### 3. Validate a task title string

**Problem**

Check whether a string is empty, too short, or contains invalid characters.

**Without AI**

- Time spent: 15 minutes
- Approach: wrote conditional checks and a regular expression manually
- Result: functional, but the regex took time to get right
- Understanding: high, because I had to think through each rule

**With AI**

- Time spent: 5 minutes
- Approach: asked for a validation function with clear rules
- Result: same validation logic, but more structured and easier to reuse
- Understanding: medium, because the AI helped confirm the structure

**Comparison**

- AI saved time mostly on the regex and function structure
- Manual work gave better confidence in edge cases
- Best outcome came from writing the first draft myself and then checking the AI version

## Part 2: TaskFlow Project Tasks

### 1. Refactor `addTask()` and save flow

**Task**

Improve the task creation flow in `FirstWeb/js/task-manager.js` without changing behavior.

**Without AI**

- Time spent: 20 minutes
- Approach: manually split the code into smaller helpers
- Result: cleaner than the original, but still repetitive
- Understanding: high, because I traced every branch myself

**With AI**

- Time spent: 7 minutes
- Approach: asked for a senior-level refactor with no behavior changes
- Result: smaller helper functions such as `syncTaskView()` and `saveTaskEdits()`
- Understanding: medium-high, because the new structure was easier to scan

**Comparison**

- AI improved the speed of the refactor
- The final code was easier to maintain
- Manual review was still important to make sure behavior stayed stable

### 2. Improve task title validation

**Task**

Strengthen validation for task titles in `validateTaskTitle()` and related helpers.

**Without AI**

- Time spent: 18 minutes
- Approach: checked length and allowed characters manually
- Result: worked, but the logic was spread across the file
- Understanding: high, because each rule was written intentionally

**With AI**

- Time spent: 6 minutes
- Approach: asked for a reusable validation helper and safer normalization
- Result: validation became more consistent and easier to test
- Understanding: medium, because the AI surfaced a cleaner way to structure the checks

**Comparison**

- AI made the validation flow more reusable
- Manual implementation was useful for learning how the rules interact
- This task benefited a lot from splitting logic into shared helpers

### 3. Document the TaskFlow module

**Task**

Write technical documentation for `FirstWeb/js/task-manager.js`.

**Without AI**

- Time spent: 25 minutes
- Approach: read the module and wrote a summary manually
- Result: accurate, but somewhat long and repetitive
- Understanding: very high, because I had to inspect each function

**With AI**

- Time spent: 8 minutes
- Approach: asked for a short developer-oriented module summary
- Result: clearer structure with sections for purpose, inputs, outputs, and dependencies
- Understanding: high, because the generated structure made the module easier to explain

**Comparison**

- AI was especially helpful for organizing documentation
- Manual writing gave stronger comprehension of the codebase
- The best result was a mix of both: understand first, then let AI help polish the wording

## Summary Table

| Task | Manual Time | AI Time | Code Quality | Understanding |
| --- | --- | --- | --- | --- |
| Count completed items | 8 min | 3 min | Better with AI | Higher manually |
| Remove duplicates | 12 min | 4 min | Better with AI | Strong in both |
| Validate task title | 15 min | 5 min | More reusable with AI | Higher manually |
| Refactor `addTask()` | 20 min | 7 min | Cleaner with AI | Strong in both |
| Improve validation | 18 min | 6 min | More consistent with AI | Higher manually |
| Document module | 25 min | 8 min | Better structure with AI | Higher manually |

## Conclusions

The experiment showed that AI is most useful when the task already has a clear goal.
It reduces time, improves structure, and helps find cleaner implementations.

Manual work was still valuable because it gave deeper understanding of the problem.
The best workflow was:

1. solve the task once without AI
2. compare the result with AI assistance
3. keep the strongest parts of each version

For TaskFlow, AI was especially useful for refactoring, documentation, and reusable helpers.
Manual problem solving was still important for learning, validation, and confidence in the final result.
