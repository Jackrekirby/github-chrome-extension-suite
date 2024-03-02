import {
  createAuthorBranchLabel as createAuthorBranchButton,
  createPlaceholderAuthorBranchLabel as createPlaceholderAuthorBranchButton,
} from "./components";
import {
  GITHUB_TOKEN,
  doesBranchExist,
  getUser,
  whoIfAnyoneIsInBranch,
} from "./github";
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

async function createWhoIsInBranchPanel(
  repoOwner: string | null,
  repository: string | null
) {
  // return true if the section was created

  const navElement = document.querySelector(
    'nav[role="navigation"]'
  ) as HTMLElement;

  if (!navElement) {
    return false;
  }

  navElement.style.display = "flex";
  navElement.style.alignItems = "center";
  navElement.style.justifyContent = "space-between";
  navElement.style.flexDirection = "row";

  let wrapper = document.getElementById(
    "who-is-in-branch-wrapper"
  ) as HTMLElement;

  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "who-is-in-branch-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "flex-end";
    wrapper.style.flexDirection = "row";

    navElement.appendChild(wrapper);
  }

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
    wrapper.appendChild(createPlaceholderAuthorBranchButton("development"));
    wrapper.appendChild(createPlaceholderAuthorBranchButton("staging"));

    const githubUser = await getUser();

    const authors = {
      development: await whoIfAnyoneIsInBranch(
        branchNames.development,
        branchNames.staging
      ),
      staging: await whoIfAnyoneIsInBranch(
        branchNames.staging,
        branchNames.production
      ),
    };

    log("authors", authors);

    Object.entries(authors).forEach(([fromBranchAlias, author]) => {
      const nextBranchAlias =
        fromBranchAlias === "development" ? "staging" : "production";

      const fromBranchName = branchNames[
        fromBranchAlias as "development" | "staging"
      ] as string;
      const nextBranchName = branchNames[nextBranchAlias] as string;

      const button = createAuthorBranchButton(
        author,
        fromBranchAlias,
        githubUser
      );
      button.href = `https://github.com/${repoOwner}/${repository}/compare/${nextBranchName}...${fromBranchName}`;

      wrapper.appendChild(button);
    });

    return true;
  }
  return false;
}

export const initialiseWhoIsInTheBranch = () => {
  log("initialising 'who is in the branch'");

  let repository: string | null = null;
  let repoOwner: string | null = null;

  const observer = new MutationObserver(async (_mutationsList, _observer) => {
    // observer may trigger multiple times whilst custom components being created
    // we only want to create the sidebar section once so we use the
    // executeWithCooldown function to prevent multiple executions
    // and add a cooldown of 500ms to avoid hogging resources
    const url = window.location.href;
    const regex = new RegExp("^https://github.com/.+/.+");

    const currentRepository = window.location.pathname.split("/")[2];

    if (regex.test(url) && GITHUB_TOKEN && repository !== currentRepository) {
      log("repository", repository, currentRepository);
      repoOwner = window.location.pathname.split("/")[1];
      repository = currentRepository;
      executeWithCooldown(
        "createWhoIsInBranchPanel",
        () => createWhoIsInBranchPanel(repoOwner, repository),
        500
      );
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
