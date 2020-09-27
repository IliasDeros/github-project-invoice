# Github Project Invoice

For some **freelance contracts**, I use [Github projects](https://github.com/features/project-management/) to track progress and time estimates, which I use for billing.

![Issue](./issue-screenshot.png)

## Prerequisites
- Node & `yarn`
- A [github access token](https://github.com/settings/tokens) including `repo` and `read:org` scopes
- A github repo with project(s) that include a "Done" column and "0h" labels

## Getting Started
1. Install dependencies - `yarn`
2. Add environment variables - `vi .env`
2. Run the script - `yarn start`

## The script does the following
1. Find projects in a repo
2. Identify all issue cards in the _Done_ column
3. For each card, add a row to invoice_items.csv containing `name,hours`
