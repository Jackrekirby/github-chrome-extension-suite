import { CreateBranchTransitionElement } from "./components";
import { GITHUB_TOKEN, doesBranchExist } from "./github";
import { executeWithCooldown, log } from "./tools";

async function findFirstExistingBranch(
  branches: string[]
): Promise<string | null> {
  for (const branch of branches) {
    if (await doesBranchExist(branch)) {
      return branch;
    }
  }
  return null;
}

async function createWarnSkipBranchPanel() {
  // return true if the section was created

  const branchNames = {
    development: await findFirstExistingBranch(["development", "dev"]),
    staging: "staging",
    production: await findFirstExistingBranch(["main", "master"]),
  };

  log("branch names", branchNames);

  if (
    branchNames.development !== null &&
    branchNames.staging !== null &&
    branchNames.production !== null
  ) {
    log("expected universes exist");

    const parentElement = document.getElementById("partial-discussion-header");

    if (!parentElement) {
      log("parent element not found");
      return true;
    }
    // log("parent element", parentElement);
    // query selector for span with classes css-truncate-target, no other classes, and no children
    const potentialTargets = parentElement.querySelectorAll(
      "span.css-truncate-target:not([class*=' '])"
    );
    // log("potential targets", potentialTargets);

    let toBranch: string | null = null;
    let fromBranch: string | null = null;

    let i = 0;
    for (const potentialTarget of potentialTargets) {
      // print out the text content of the span
      // log("potential target", i, potentialTarget.textContent);
      if (toBranch === null) {
        toBranch = potentialTarget.textContent;
      } else if (
        fromBranch === null &&
        potentialTarget.textContent !== toBranch
      ) {
        fromBranch = potentialTarget.textContent;
      }
      i += 1;
    }

    log("branches [to, from]", toBranch, fromBranch);

    if (toBranch === null || fromBranch === null) {
      return true;
    }
    let recognisedBranchTransition = false;

    if (
      fromBranch === branchNames.development &&
      toBranch === branchNames.staging
    ) {
      log("development to staging");
      recognisedBranchTransition = true;
    } else if (
      fromBranch === branchNames.staging &&
      toBranch === branchNames.production
    ) {
      log("staging to production");
      recognisedBranchTransition = true;
    } else if (
      ![branchNames.staging, branchNames.production].includes(fromBranch) &&
      toBranch === branchNames.development
    ) {
      log("feature to dev");
      recognisedBranchTransition = true;
    } else {
      log("branch transition not recognised");
    }

    // find svg with class octicon octicon-copy
    const neighbourElement = parentElement.querySelector(
      "svg.octicon.octicon-copy"
    );

    if (neighbourElement === null) {
      log("neighbour element not found");
      return true;
    }

    const warnElement = CreateBranchTransitionElement(
      recognisedBranchTransition
    );

    neighbourElement.parentElement?.parentElement?.parentElement?.appendChild(
      warnElement
    );

    return true;
  }
  return false;
}

export const initialiseWarnSkipBranch = () => {
  log("initialising 'warn of skipped branch'");

  let repository: string | null = null;
  let pullRequestNumber: number | null = null;

  const observer = new MutationObserver(async (_mutationsList, _observer) => {
    // observer may trigger multiple times whilst custom components being created
    // we only want to create the sidebar section once so we use the
    // executeWithCooldown function to prevent multiple executions
    // and add a cooldown of 500ms to avoid hogging resources
    const url = window.location.href;
    const regex = new RegExp("^https://github.com/.+/.+/pull/\\d+");

    const currentRepository = window.location.pathname.split("/")[2];
    const currentPullRequestNumber = Number(
      window.location.pathname.split("/")[4]
    );

    if (
      regex.test(url) &&
      GITHUB_TOKEN &&
      repository !== currentRepository &&
      pullRequestNumber !== currentPullRequestNumber
    ) {
      log("repository", repository, currentRepository);
      repository = currentRepository;
      pullRequestNumber = currentPullRequestNumber;

      log("pull request number", pullRequestNumber);
      executeWithCooldown(
        "createWarnSkipBranchPanel",
        () => createWarnSkipBranchPanel(),
        500
      );
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
