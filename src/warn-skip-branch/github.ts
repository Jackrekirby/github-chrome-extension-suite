import { error } from "./tools";

export let GITHUB_TOKEN = "";

chrome.storage.sync.get(["GITHUB_TOKEN"], (r) => {
  if (!r.GITHUB_TOKEN) {
    error("GITHUB_TOKEN not set");
    return;
  }
  GITHUB_TOKEN = r.GITHUB_TOKEN;
});

export async function doesBranchExist(branchName: string) {
  const repoPath = window.location.pathname.split("/").slice(1, 3).join("/");

  const url = `https://api.github.com/repos/${repoPath}/branches/${branchName}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });
    if (!response.ok) {
      // error(`Branch ${branchName} not found`);
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
