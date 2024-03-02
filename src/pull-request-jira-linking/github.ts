import { error } from "./tools";

export let GITHUB_TOKEN = "";

chrome.storage.sync.get(["GITHUB_TOKEN"], (r) => {
  if (!r.GITHUB_TOKEN) {
    error("GITHUB_TOKEN not set");
    return;
  }
  GITHUB_TOKEN = r.GITHUB_TOKEN;
});

export async function getPrDetails() {
  const [_1, owner, repo, _2, pull_number] =
    window.location.pathname.split("/");
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { title: data.title as string, description: data.body as string };
}

export async function setPrDescription(description: string) {
  const [_1, owner, repo, _2, pull_number] =
    window.location.pathname.split("/");
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      body: description,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
