import { log } from "./tools";

export type CommitDetails = {
  name: string;
  index: number;
};

export type Getter<T> = () => T;
export type Setter<T> = (newValue: T) => void;

export type State<T> = {
  get: Getter<T>;
  set: Setter<T>;
};

export const createState = <T>(initialValue: T): State<T> => {
  let currentState = initialValue;
  return {
    get: () => currentState,
    set: (newValue: T) => {
      currentState = newValue;
    },
  };
};

export const observeValueChange = <T>(initialValue: T) => {
  let currentValue = initialValue;
  return (newValue: T) => {
    const hasChanged = currentValue !== newValue;
    currentValue = newValue;
    return hasChanged;
  };
};

const addBadgeStylingToDocumentHead = () => {
  if (!document.getElementById("badgeStyles")) {
    log("adding badge styles to document head");
    const style = document.createElement("style");
    style.id = "badge-styles";
    style.innerHTML = `
          .badge:before {
            position: absolute;
            top: -6px;
            left: 2px;
            content: "";
            display: block;
            width: 28px;
            height: 28px;
            background-color: var(--timelineBadge-bgColor, var(--color-timeline-badge-bg));
            z-index: -1;
            border-radius: 50%;
            box-sizing: border-box;
            border: var(--borderWidth-thick, max(2px, 0.125rem)) solid var(--bgColor-default, var(--color-canvas-default))
            transition: background-color 0.3s ease;
          }
        
          .badge:hover:before {
            background-color: white;
            border: 4px solid var(--timelineBadge-bgColor, var(--color-timeline-badge-bg));
          }
    
          .badge.badge-clicked:before {
            background-color: #ff87ee;
          }
    
          .badge.badge-clicked:hover:before {
            background-color: white;
            border: 4px solid #ff87ee;
          }
    
          .badge.badge-clicked:not(:hover) > svg {
            color: var(--fgColor-onEmphasis, var(--color-fg-on-emphasis)) !important;
          }
        `;

    document.head.appendChild(style);
  }
};

export const isOnPullRequestConversationTab = () => {
  const url = window.location.href;
  const pattern = /https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+$/;
  return pattern.test(url);
};

const createCompareLink = (commit1: string, commit2: string) => {
  const url = window.location.href; // assume we are on a PR conversation tab
  const baseUrl = url.split("/").slice(0, 7).join("/");
  const compareLink = `${baseUrl}/files/${commit1}..${commit2}`;
  return compareLink;
};

const addBadgeFunctionality = (
  setSelectedCommit: Setter<CommitDetails | null>,
  badgeElement: HTMLElement,
  commitDetails: CommitDetails
) => {
  badgeElement.classList.add("badge");

  // if element is already clicked, remove the clicked class
  // else, add the clicked class and remove it from all other elements
  badgeElement.onclick = () => {
    if (badgeElement.classList.contains("badge-clicked")) {
      badgeElement.classList.remove("badge-clicked");
      setSelectedCommit(null);
      log("cleared selected commit");
    } else {
      document.querySelectorAll(".badge-clicked").forEach((element) => {
        element.classList.remove("badge-clicked");
      });

      badgeElement.classList.add("badge-clicked");
      setSelectedCommit(commitDetails);
      log("set selected commit", commitDetails);
    }
  };
};

const addCompareLinkFunctionality = (
  getSelectedCommit: Getter<CommitDetails | null>,
  linkElement: HTMLAnchorElement,
  compareCommitDetails: CommitDetails
) => {
  linkElement.addEventListener("click", function (event) {
    event.preventDefault();

    const href = this.getAttribute("href") as string;

    let link: string;
    const selectedCommit = getSelectedCommit();
    if (selectedCommit) {
      if (selectedCommit.index < compareCommitDetails.index) {
        link = createCompareLink(
          selectedCommit.name,
          compareCommitDetails.name
        );
      } else {
        link = createCompareLink(
          compareCommitDetails.name,
          selectedCommit.name
        );
      }
      log("compare commits link clicked", link);
    } else {
      link = href;
    }

    if (event.ctrlKey) {
      // Open in a new tab if control is pressed
      window.open(link, "_blank");
    } else {
      // Open in the same tab if control is not pressed
      window.location.href = link;
    }
  });
};

export const addCommitCompareFunctionality = (
  selectedCommitState: State<CommitDetails | null>
) => {
  addBadgeStylingToDocumentHead();

  const timelineElements = Array.from(
    document.querySelectorAll(".TimelineItem")
  );

  log("timeline elements", timelineElements.length, { timelineElements });

  timelineElements.forEach((element: Element, index: number) => {
    const linkElements = element.querySelectorAll(
      'a[href^="/"][href*="/pull/"][href*="/commits/"]'
    );

    const badgeElement = element.querySelector(
      ".TimelineItem-badge"
    ) as HTMLElement;

    if (linkElements[1]?.textContent && badgeElement) {
      const commitDetails: CommitDetails = {
        name: linkElements[1].textContent,
        index,
      };
      // log("commit details", commitDetails);

      addBadgeFunctionality(
        selectedCommitState.set,
        badgeElement,
        commitDetails
      );

      for (const linkElement of linkElements) {
        addCompareLinkFunctionality(
          selectedCommitState.get,
          linkElement as HTMLAnchorElement,
          commitDetails
        );
      }
    }
  });
};
