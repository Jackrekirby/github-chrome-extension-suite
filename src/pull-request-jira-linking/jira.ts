import { error } from "./tools";

export let ATLASSIAN_SUBDOMAIN = "";

chrome.storage.sync.get(["ATLASSIAN_SUBDOMAIN"], (r) => {
  if (!r.ATLASSIAN_SUBDOMAIN) {
    error("ATLASSIAN_SUBDOMAIN not set");
    return;
  }
  ATLASSIAN_SUBDOMAIN = r.ATLASSIAN_SUBDOMAIN;
});
