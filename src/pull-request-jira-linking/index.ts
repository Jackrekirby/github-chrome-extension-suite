import { GITHUB_TOKEN, getPrDetails, setPrDescription } from "./github";
import { ATLASSIAN_SUBDOMAIN } from "./jira";
import { executeWithCooldown, log } from "./tools";

function createJiraLinkButton() {
  const existingButton: HTMLButtonElement | null =
    document.querySelector("#jira-link-button");
  if (existingButton) {
    // button already exists
    return existingButton;
  }

  const button = document.createElement("button");
  button.id = "jira-link-button";
  button.style.display = "flex";
  button.style.flexDirection = "row";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.style.border = "none";

  button.style.outline = "none";
  button.style.boxShadow = "none";
  button.style.borderRadius = "4px";
  button.style.padding = "2px 4px";

  // Create img
  const img = document.createElement("img");
  img.setAttribute("src", chrome.runtime.getURL("jira.svg"));
  img.style.width = "18px";
  img.style.height = "18px";

  // Add img and text to button
  button.appendChild(img);
  return button;
}

async function createJiraLinkComponents() {
  // return true if we create the jira link

  const header: Element | null = document.querySelector(
    ".timeline-comment-header"
  );

  if (!header) {
    // not pr header to put button in
    return false;
  }

  let { title, description } = await getPrDetails();
  if (!description) {
    description = "";
  }

  const ticketRegex = /\b([A-Za-z]+-\d+)\b/gi;
  const ticketMatches = title.match(ticketRegex);
  if (!ticketMatches) {
    return false;
  }

  // capitalise, remove brackets and remove whitespace
  const tickets = ticketMatches.map((ticket) =>
    ticket
      .toUpperCase()
      .trim()
      .replace(/^[\[\]]+|[\[\]]+$/g, "")
  );

  const atlassianLink = `https://${ATLASSIAN_SUBDOMAIN}.atlassian.net`;

  log("pr details", { title, description }, "tickets", tickets);

  const button: HTMLButtonElement = createJiraLinkButton();
  header.insertBefore(button, header.children[1]);

  // just check for atlassian link, may not be any/all tickets in title
  const linkAlreadyExists =
    description.includes(atlassianLink + "/browse") ||
    description.includes(atlassianLink + "/jira");

  const links = tickets.map((ticket) => `${atlassianLink}/browse/${ticket}`);
  const buttonLabel = document.querySelector("#jira-link-label");

  if (linkAlreadyExists) {
    button.onclick = function () {
      log("going to jira ticket(s)");
      links.map((link) => window.open(link, "_blank"));
    };
    button.style.background = "rgba(255,255,255,0)";

    if (buttonLabel) {
      buttonLabel.remove();
    }
  } else {
    if (!buttonLabel) {
      const label = document.createElement("div");
      label.id = "jira-link-label";
      label.textContent = "Link to Jira";
      label.style.marginLeft = "4px";
      button.appendChild(label);
    }

    button.style.background = "rgba(255,255,255,0.5)";

    button.onclick = async function () {
      log("adding link(s) to jira");
      await setPrDescription([...links, description].join("\n\n"));
      button.remove();
    };
  }
}

const isUrlSupported = () => {
  let path = window.location.pathname;
  let pattern = /^\/[^\/]+\/[^\/]+\/pull\/[^\/]+\/?$/;

  return pattern.test(path);
};

export const initialisePullRequestJiraLinking = () => {
  log("initialising 'pull request jira linking'");

  const observer = new MutationObserver(async (_mutationsList, _observer) => {
    if (isUrlSupported() && GITHUB_TOKEN && ATLASSIAN_SUBDOMAIN) {
      executeWithCooldown(
        "createJiraLinkComponents",
        createJiraLinkComponents,
        500
      );
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
