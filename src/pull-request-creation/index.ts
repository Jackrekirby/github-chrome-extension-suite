import {
  getPrBranchElements,
  createButton,
  truncateWithEllipses,
  buildCreatePrOnClick,
  svgNew,
  svgCopy,
  replaceFirstMatchingWord,
} from "./components";
import { GITHUB_TOKEN, doesBranchExist, getPrDetails } from "./github";
import {
  UPDATE_PR_DETAILS_CONTENT_ACTION,
  error,
  executeWithCooldown,
  log,
} from "./tools";

type UniverseBranchConfig = {
  currentBranch: string[];
  nextBranch: string[];
  nextBranchAlias: string;
};

const universeBranchConfigs: UniverseBranchConfig[] = [
  {
    currentBranch: ["staging"],
    nextBranch: ["main", "master"],
    nextBranchAlias: "Production",
  },
  {
    currentBranch: ["dev", "development"],
    nextBranch: ["staging"],
    nextBranchAlias: "Staging",
  },
];

async function getNextToBranch(toBranchName: string): Promise<string | null> {
  for (const universeBranchConfig of universeBranchConfigs) {
    if (universeBranchConfig.currentBranch.includes(toBranchName)) {
      for (const branch of universeBranchConfig.nextBranch) {
        if (await doesBranchExist(branch)) {
          return branch;
        }
      }
    }
  }
  return null;
}

async function createPullRequestSidebarSection() {
  // return true if the sidebar section was created

  if (document.querySelector(".sidebar-clone-pr")) {
    // if the section already exists, do not create it again
    return false;
  }

  const sidebar: Element | null = document.querySelector(
    "#partial-discussion-sidebar"
  );

  if (!sidebar) {
    // if sidebar does not exist no where to insert the section
    return false;
  }

  const prBranchElements = getPrBranchElements();

  if (!prBranchElements[0] || !prBranchElements[1]) {
    // must know the branches to create the section
    return false;
  }

  const toBranchName = (prBranchElements[0].textContent ?? "").trim();
  const fromBranchName = (prBranchElements[1].textContent ?? "").trim();
  log({ type: "pr branches", from: fromBranchName, to: toBranchName });

  const nextToBranch = await getNextToBranch(toBranchName);

  const mainDiv = document.createElement("div");
  mainDiv.setAttribute("id", "sidebar-clone-pr");
  mainDiv.setAttribute("class", "discussion-sidebar-item sidebar-clone-pr");
  mainDiv.style.paddingTop = "0px";
  sidebar.insertBefore(mainDiv, sidebar.firstChild);

  const { title, description } = await getPrDetails();

  if (nextToBranch) {
    // if next branch exists, create a button to create a PR to it
    log({ nextToBranch });

    const branchConfig: UniverseBranchConfig | undefined =
      universeBranchConfigs.find((config) =>
        config.nextBranch.includes(nextToBranch)
      );

    if (!branchConfig) {
      error("Universe Branch Config configured incorrectly!");
      return false;
    }

    const wordsToReplace = ["STAGING", "DEVELOPMENT", "DEV"];

    const newTitle = replaceFirstMatchingWord(
      title,
      branchConfig.nextBranchAlias.toUpperCase(),
      wordsToReplace
    );

    log("title formatting", { title, newTitle });

    const createNextPr = createButton(
      `${truncateWithEllipses(nextToBranch)} from ${truncateWithEllipses(
        toBranchName
      )}`,
      buildCreatePrOnClick(toBranchName, nextToBranch, newTitle, description),
      svgNew()
    );
    mainDiv.appendChild(createNextPr);
  }

  // always create a button to copy the PR
  const copyPr = createButton(
    `${truncateWithEllipses(toBranchName)} from ${truncateWithEllipses(
      fromBranchName
    )}`,
    buildCreatePrOnClick(fromBranchName, toBranchName, title, description),
    svgCopy()
  );
  mainDiv.appendChild(copyPr);
}

const insertTitleAndDescription = (title: string, description: string) => {
  const titleElement: HTMLInputElement | null = document.querySelector(
    "#pull_request_title"
  );

  const descriptionElement: HTMLTextAreaElement | null =
    document.querySelector("#pull_request_body");

  const createPrElement: HTMLButtonElement | null = document.querySelector(
    ".hx_create-pr-button"
  );

  const observer = new MutationObserver(async (_mutationsList, observer) => {
    if (titleElement && descriptionElement && createPrElement) {
      titleElement.value = title;
      descriptionElement.value = description;

      // When you set titleElement.value = title; programmatically, GitHub's event
      // listeners are not fired,  so don't know that the value has changed.
      // Solved by manually dispatching an 'input' event after setting the value.
      const event = new Event("input", { bubbles: true });
      titleElement.dispatchEvent(event);
      descriptionElement.dispatchEvent(event);

      // Disconnect the observer now complete
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  if (request.action === UPDATE_PR_DETAILS_CONTENT_ACTION) {
    log("UPDATE_PR_DETAILS_CONTENT_ACTION", {
      title: request.title,
      description: request.description,
    });
    insertTitleAndDescription(request.title, request.description);
  }
});

export const initialisePullRequestCreation = () => {
  log("initialising 'pull request creation'");

  const observer = new MutationObserver(async (_mutationsList, _observer) => {
    // observer may trigger multiple times whilst custom components being created
    // we only want to create the sidebar section once so we use the
    // executeWithCooldown function to prevent multiple executions
    // and add a cooldown of 500ms to avoid hogging resources
    const url = window.location.href;
    const regex = new RegExp("^https://github.com/.+/.+/pull/[0-9]+$");
    // log("observing");
    if (regex.test(url) && GITHUB_TOKEN) {
      // log("url matches and github token found");
      executeWithCooldown(
        "createPullRequestSidebarSection",
        createPullRequestSidebarSection,
        500
      );
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
