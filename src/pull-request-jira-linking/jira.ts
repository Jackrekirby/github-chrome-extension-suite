import { error } from "./tools";

export let ATLASSIAN_SUBDOMAIN = "";

chrome.storage.sync.get(["atlassian-subdomain"], (r) => {
  if (!r["atlassian-subdomain"]) {
    error("atlassian-subdomain not set");
    return;
  }
  ATLASSIAN_SUBDOMAIN = r["atlassian-subdomain"];
});
