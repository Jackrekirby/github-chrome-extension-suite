import { observeValueChange } from "./components";
import { error, log } from "./tools";

export let PULL_REQUEST_FILTER_URL_SEARCH_PARAMS = "";

chrome.storage.sync.get(["pull-request-filter-url-search-params"], (r) => {
  if (!r["pull-request-filter-url-search-params"]) {
    PULL_REQUEST_FILTER_URL_SEARCH_PARAMS = "";
  } else {
    PULL_REQUEST_FILTER_URL_SEARCH_PARAMS =
      r["pull-request-filter-url-search-params"];
  }
});

const addFilterToLinkElement = () => {
  const element = document.querySelector(
    "#pull-requests-tab"
  ) as HTMLLinkElement | null;
  if (element) {
    const url = new URL(element.href);
    url.search = PULL_REQUEST_FILTER_URL_SEARCH_PARAMS;
    element.href = url.href;
  }
};

export const initialiseDefaultPullRequestFilters = () => {
  log("initialising 'default pull request filters'");

  const hasUrlChanged = observeValueChange<string | null>(null);

  const observer = new MutationObserver(async (_mutationsList, _observer) => {
    if (hasUrlChanged(window.location.href)) {
      addFilterToLinkElement();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
