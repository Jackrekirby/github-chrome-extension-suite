# GitHub Suite

This chrome extension contains a suite of tools to extend Github's functionality

## Tools

### Who is in the Branch

Displays if anyone is in the development or staging branches of a GitHub repository.

Green = No one in branch
Purple = You are in the branch
Red = Someone else is in the branch

### Warn of Skipped Branches

Displays whether or not the branch transition in a pull request is a recognised one. Aims to prevent one accidentally merging straight from feature to production.

Recognised transitions:

1. Feature to Development
2. Development to Staging
3. Staging to Production

### Pull Request Creation

Adds two buttons in the sidebar of a GitHub pull request.

1. One button will create a PR in the following universe (local -> development -> staging -> production).
2. Another button will copy the current PR (useful when pushing a fix to the same universe).

### Compare Commits

Enables you to compare commits from the conversation tab of a Github pull request.

### Pull Request Jira Linking

Adds a button in the description header of a GitHub pull request. If a Jira ticket is not provided in the description the button will insert the link in the description. If the Jira ticket is already in the description the button will open a new tab and take you to the Jira ticket.

The Jira ticket name(s) are extracted from the pull request title. Expected format `[A-Za-z]+-\d+`, e.g., ABC-123 or abcd-1234.

### Files Changed Sidebar Resize

When viewing the diff for a pull request on GitHub there is a sidepanel listing the files changed. If the file names are too long they are truncated with elipses. This feature adds a `+` button at the top right of the sidebar which when clicked toggles the sidepanel between its original size (~300px) and 500px.

### Default Pull Request Filter

When you go to the pull request tab, you can optionally apply filters to the search. This tool allows you to save a default set of filters by setting the url query parameters of the page.

The default that this tool applies is to sort by the most recently updated open pull request.
`q=is%3Apr+is%3Aopen+sort%3Aupdated-desc`

## Extension Requirements

This extension needs your API token for Github.

1. To generate an API token goto: <https://github.com/settings/tokens>
2. Generate a classic token
3. Give the token the `repo` permission scope.
4. Goto the extension options found at `chrome://extensions/` to add these credentials.

## User Installation

1. Go to `chrome://extensions/`
2. Select `load unpacked`
3. Navigate to the project directory

## Dev Installation

Built with node 16

`npm i`

`npx webpack --watch`
