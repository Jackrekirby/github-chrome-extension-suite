import { initialiseCompareCommits } from "./compare-commits";
import { initialiseDefaultPullRequestFilters } from "./default-pull-request-filters";
import { initialiseFilesChangedSidebarResize } from "./files-changed-sidebar-resize";
import { initialisePullRequestCreation } from "./pull-request-creation";
import { initialisePullRequestJiraLinking } from "./pull-request-jira-linking";
import { initialiseWhoIsInTheBranch } from "./who-is-in-the-branch";

const features = {
  "feature-who-is-in-the-branch": initialiseWhoIsInTheBranch,
  "feature-pull-request-creation": initialisePullRequestCreation,
  "feature-compare-commits": initialiseCompareCommits,
  "feature-files-changed-sidebar-resize": initialiseFilesChangedSidebarResize,
  "feature-pull-request-jira-linking": initialisePullRequestJiraLinking,
  "feature-default-pull-request-filters": initialiseDefaultPullRequestFilters,
};
chrome.storage.sync.get(Object.keys(features), (r) => {
  for (const [feature, initialise] of Object.entries(features)) {
    console.log(feature, !r[feature] ? "enabled" : "disabled");
    if (r[feature] !== true) {
      initialise();
    }
  }
});
