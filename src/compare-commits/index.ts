import {
  CommitDetails,
  State,
  addCommitCompareFunctionality,
  createState,
  isOnPullRequestConversationTab,
  observeValueChange,
} from "./components";
import { log } from "./tools";

export function svgPlus() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "height", "24");
  svg.setAttributeNS(null, "width", "24");
  svg.setAttributeNS(null, "viewBox", "0 0 512 512");
  svg.setAttribute("class", "hoverable-svg"); // Add a class to the SVG

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttributeNS(
    null,
    "d",
    "M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
  );
  path.setAttributeNS(null, "fill", "#737d83");

  svg.appendChild(path);

  // Add the hover style dynamically
  const style = document.createElement("style");
  style.textContent = `
     .hoverable-svg:hover path {
       fill: #ff87ee;
     }
   `;
  document.head.append(style);
  return svg;
}

export const initialiseCompareCommits = () => {
  log("initialising 'compare commits'");

  const hasUrlChanged = observeValueChange<string | null>(null);

  const observer = new MutationObserver(async (_mutationsList, _observer) => {
    {
      let navElement = document.querySelector(
        "#files_bucket .subnav-search"
      ) as HTMLElement | null;

      let searchIconElement = document.querySelector(
        "#files_bucket .subnav-search-icon"
      ) as HTMLElement | null;

      let layoutElement = document.querySelector(
        "#files_bucket .Layout"
      ) as HTMLElement | null;

      let resizerElement: any = document.getElementById(
        "subnav-search-resizer"
      );
      if (searchIconElement && layoutElement && navElement && !resizerElement) {
        searchIconElement.style.top = "unset";

        navElement.style.display = "flex";
        navElement.style.alignItems = "center";
        navElement.style.justifyContent = "center";
        resizerElement = svgPlus();
        resizerElement.style.margin = "8px";
        resizerElement.style.marginRight = "0px";
        resizerElement.id = "subnav-search-resizer";
        navElement.appendChild(resizerElement);

        const initialWidth = layoutElement.style.getPropertyValue(
          "--Layout-sidebar-width"
        );
        resizerElement.onclick = () => {
          if (layoutElement) {
            const currentWidth = layoutElement.style.getPropertyValue(
              "--Layout-sidebar-width"
            );
            let newWidth = "";
            if (initialWidth === currentWidth) {
              newWidth = "512px";
            }
            layoutElement.style.setProperty("--Layout-sidebar-width", newWidth);
          }
        };
      }
    }

    if (
      hasUrlChanged(window.location.href) &&
      isOnPullRequestConversationTab()
    ) {
      log("adding commit compare functionality");
      let selectedCommitState: State<CommitDetails | null> =
        createState<CommitDetails | null>(null);
      setTimeout(() => addCommitCompareFunctionality(selectedCommitState), 100);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
