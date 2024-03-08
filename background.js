// INCOMING ACTIONS
const UPDATE_PR_DETAILS_BACKGROUND_ACTION =
  "UPDATE_PR_DETAILS_BACKGROUND_ACTION";

// OUTGOING ACTIONS
const UPDATE_PR_DETAILS_CONTENT_ACTION = "UPDATE_PR_DETAILS_CONTENT_ACTION";

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  if (request.action === UPDATE_PR_DETAILS_BACKGROUND_ACTION) {
    chrome.tabs.create({ url: request.url }, (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === "complete" && tabId === tab.id) {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.tabs.sendMessage(tabId, {
            action: UPDATE_PR_DETAILS_CONTENT_ACTION,
            title: request.title,
            description: request.description,
          });
        }
      });
    });
  }
});
