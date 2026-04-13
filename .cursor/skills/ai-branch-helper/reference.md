# AI Branch Helper Reference

## Common Branch Flows

### 1) Start a new feature branch

```bash
git status --short --branch
git switch main
git pull --ff-only
git switch -c feature/add-user-filter
```

Use when starting new scoped work from an updated base branch.

### 2) Switch to an existing branch

```bash
git status --short --branch
git switch feature/add-user-filter
git branch -vv
```

If there are local uncommitted changes, decide to commit, stash, or keep them before switching.

### 3) Sync branch with main (rebase)

```bash
git fetch origin
git switch feature/add-user-filter
git rebase origin/main
```

Use rebase to keep linear history. Resolve conflicts, then continue:

```bash
git add <resolved-files>
git rebase --continue
```

### 4) Sync branch with main (merge)

```bash
git fetch origin
git switch feature/add-user-filter
git merge origin/main
```

Use merge when preserving branch merge history is preferred.

### 5) Push branch and set upstream

```bash
git push -u origin HEAD
git branch -vv
```

Confirms tracking and ahead/behind status.

## PR Readiness Commands

```bash
git status --short --branch
git diff --stat
git diff --name-only
git log --oneline --decorate -n 10
```

Optional comparison with base:

```bash
git diff origin/main...HEAD --stat
git diff origin/main...HEAD --name-only
```

## Safety Checklist

- Confirm current branch before any pull/rebase/merge.
- Avoid destructive commands unless explicitly requested.
- Prefer `git pull --ff-only` on base branches.
- Warn when switching branches with a dirty working tree.
- Re-run status checks after each major git operation.

## Suggested Branch Naming

- `feature/<topic>`
- `fix/<topic>`
- `chore/<topic>`
- `refactor/<topic>`

Examples:

- `feature/project-settings-panel`
- `fix/login-redirect-loop`
- `chore/update-eslint-config`
