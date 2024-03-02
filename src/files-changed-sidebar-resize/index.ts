import { svgPlus } from "../compare-commits";
import { observeValueChange } from "./components";
import { log } from "./tools";

const addResizer = () => {
  const navElement = document.querySelector(
    "#files_bucket .subnav-search"
  ) as HTMLElement | null;

  const searchIconElement = document.querySelector(
    "#files_bucket .subnav-search-icon"
  ) as HTMLElement | null;

  const layoutElement = document.querySelector(
    "#files_bucket .Layout"
  ) as HTMLElement | null;

  let resizerElement: any = document.getElementById("subnav-search-resizer");
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
};

export const initialiseFilesChangedSidebarResize = () => {
  log("initialising 'files changed sidebar resize'");

  const hasUrlChanged = observeValueChange<string | null>(null);

  const observer = new MutationObserver(async (_mutationsList, _observer) => {
    if (hasUrlChanged(window.location.href)) {
      addResizer();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
