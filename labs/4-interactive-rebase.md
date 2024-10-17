# Lab 4: Interactive Rebase

In this lab, you're going to use `git rebase --interactive` to take an outdated
feature branch and move it to the latest commit on `main`.

## Scenario

The product team has told us that a work-in-progress feature needs to be
reprioritized. This feature was partially completed, and then put on hold. The
branch is still present, so let’s bring it back up to date and deliver that
feature.

## Task 1: Checkout the Feature Branch

1. Checkout the feature branch

   ```bash
   git checkout feature/lab-4
   ```

1. Verify the feature branch is behind `main`

   ```bash
   git log --oneline --graph --all
   ```

   In the graph output, you should see that the `feature/lab-4` branch was
   created from an earlier commit on `main`.

   ```plain
   * a4f1x35 Update scoreboard size
   * f723e2f Remove comment
   * d2b828f Revert change
   | * 0f3cb0b (HEAD -> feature/lab-4) Animate score update
   |/
   * 35710de (origin/main) Add watch script
   * 6181c9c Update ESLint config
   ```

## Task 2: Rebase the Feature Branch

1. Interactively rebase the feature branch onto `main`

   ```bash
   git rebase --interactive main
   ```

   In the editor that opens, you should see a list of commits. The first commit
   is the one that the branch was created from, and the last commit is the most
   recent commit on `main`.

   ```plain
   pick 0f3cb0b Animate score update
   pick a4f1x35 Update scoreboard size
   pick f723e2f Remove comment
   pick d2b828f Revert change
   ```

   In this exercise, we want to combine all the commits on the `feature/lab-4`
   branch into a single commit. This will make it easier to follow the changes
   in the commit history.

1. Update the commit list to squash all the commits into a single commit and
   modify the commit message.

   ```plain
   reword 0f3cb0b Animate score update
   squash a4f1x35 Update scoreboard size
   squash f723e2f Remove comment
   squash d2b828f Revert change
   ```

   Save and close the editor.

   > **Hint:** If you are using VI or VIM, you can save and close the editor by
   > pressing `ESC`, typing `:wq`, and pressing `Enter`.

## Need Help?

If you're having trouble with any of the steps, you can ask for help in the
meeting chat.

The code changes for this lab can be found in the `solutions` directory.
