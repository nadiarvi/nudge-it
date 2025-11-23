# Getting Started

## Version Syncing
1. After cloning the repo, make sure to pull the latest changes on `frontend` branch into your local version.
```bash
git fetch origin
git switch frontend
git pull origin frontend
```

2. Navigate to your own workspace (the branch under your name) and merge the `frontend` branch into your branch to sync the latest update.
```bash
git switch your_branch_name
git merge frontend
```

3. Resolve merging conflicts (if any). Make sure to accept the latest version.

4. After you're done working, push the changes to your branch on the cloud and make a pull request to the `frontend` branch.
```bash
git add .
git commit -m "feat: describe your changes"
git push origin your_branch_name
```