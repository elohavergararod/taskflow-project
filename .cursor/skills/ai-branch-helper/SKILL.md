---
name: ai-branch-helper
description: Helps with safe Git branch and pull request workflows: create/switch branches, keep branches in sync, verify status/diff, and prepare PR-ready changes. Use when the user mentions branches, checkout/switch, rebase/merge main, cleanup, or PR preparation.
---

# AI Branch Helper

## Purpose

Use this skill for branch-focused Git operations and PR-readiness checks with a safety-first workflow.

## Workflow

1. Inspect repository state first:
   - Run `git status --short --branch`
   - Run `git branch -vv`
   - Run `git remote -v` when remote behavior matters
2. Clarify intent before risky operations:
   - Confirm target branch name
   - Confirm base branch (`main` unless repo uses another default)
   - Check for uncommitted changes that may block switching
3. Execute branch operation:
   - Create new branch: `git switch -c <branch-name>`
   - Switch existing branch: `git switch <branch-name>`
   - Sync with base: fetch, then rebase or merge based on user preference
4. Validate outcome:
   - Re-run status and branch tracking checks
   - Report branch, upstream, and ahead/behind state
5. Prepare PR-ready state:
   - Show concise diff summary and touched files
   - Recommend tests/lint before PR

## Safety Rules

- Never use destructive commands (`git reset --hard`, force push) unless explicitly requested.
- Never alter global/local git config as part of normal branch help.
- If working tree is dirty, warn before branch switch/rebase and suggest stash/commit options.
- Prefer `git switch` over older checkout syntax for clarity.
- If a command fails, show the cause and provide the next safest command.

## Naming Guidance

For new branches, prefer:

- `feature/<short-topic>`
- `fix/<short-topic>`
- `chore/<short-topic>`
- `refactor/<short-topic>`

Keep names lowercase with hyphens and meaningful scope.

## PR Prep Checklist

- [ ] Branch is based on latest base branch
- [ ] No unrelated files are included
- [ ] `git status` is clean except intended changes
- [ ] Diff matches requested scope
- [ ] Local validation (tests/lint/build) has been run or explicitly skipped

## Response Style

When helping the user, respond with:

1. Current branch state (1-2 lines)
2. Action taken (exact command or sequence)
3. Result (tracking and ahead/behind)
4. Next recommended step (test, commit, push, or PR)

## Additional Resources

- For practical command recipes, see [reference.md](reference.md).
