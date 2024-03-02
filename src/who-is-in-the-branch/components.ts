import { capitaliseFirstLetter } from "./tools";

function createGitCompareIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("width", "16");
  svg.setAttribute("data-view-component", "true");
  svg.setAttribute("class", "octicon octicon-git-compare");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM6 12v-1.646a.25.25 0 0 1 .427-.177l2.396 2.396a.25.25 0 0 1 0 .354l-2.396 2.396A.25.25 0 0 1 6 15.146V13.5H5A2.5 2.5 0 0 1 2.5 11V5.372a2.25 2.25 0 1 1 1.5 0V11a1 1 0 0 0 1 1ZM4 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0ZM12.75 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
  );

  svg.appendChild(path);

  return svg;
}

function createBarrierSvgIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("height", "16");
  svg.setAttribute("width", "20");
  svg.setAttribute("viewBox", "0 0 640 512");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M32 32C14.3 32 0 46.3 0 64V448c0 17.7 14.3 32 32 32s32-14.3 32-32V266.3L149.2 96H64V64c0-17.7-14.3-32-32-32zM405.2 96H330.8l-5.4 10.7L234.8 288h74.3l5.4-10.7L405.2 96zM362.8 288h74.3l5.4-10.7L533.2 96H458.8l-5.4 10.7L362.8 288zM202.8 96l-5.4 10.7L106.8 288h74.3l5.4-10.7L277.2 96H202.8zm288 192H576V448c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v53.7L490.8 288z"
  );

  svg.appendChild(path);

  return svg;
}

function createGitPullRequestClosedIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("height", "16");
  svg.setAttribute("class", "octicon octicon-git-pull-request-closed");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("width", "16");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M3.25 1A2.25 2.25 0 0 1 4 5.372v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.251 2.251 0 0 1 3.25 1Zm9.5 5.5a.75.75 0 0 1 .75.75v3.378a2.251 2.251 0 1 1-1.5 0V7.25a.75.75 0 0 1 .75-.75Zm-2.03-5.273a.75.75 0 0 1 1.06 0l.97.97.97-.97a.748.748 0 0 1 1.265.332.75.75 0 0 1-.205.729l-.97.97.97.97a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-.97-.97-.97.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l.97-.97-.97-.97a.75.75 0 0 1 0-1.06ZM2.5 3.25a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0ZM3.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm9.5 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
  );

  svg.appendChild(path);

  return svg;
}
function createLoaderDiv() {
  const div = document.createElement("div");
  div.style.border = "2px solid white"; // Light grey
  div.style.borderTop = "2px solid rgb(110, 119, 129)"; // Blue
  div.style.borderRadius = "50%";
  div.style.width = "16px";
  div.style.height = "16px";
  div.style.animation = "spin 2s linear infinite";

  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  document.head.appendChild(style);

  return div;
}

export function createPlaceholderAuthorBranchLabel(branch: string) {
  const id = `who-is-in-branch-${branch}`;
  let button = document.getElementById(id) as HTMLAnchorElement;
  if (button) {
    return button;
  }

  button = document.createElement("a");
  button.id = id;

  button.className = "flex-shrink-0 flex-self-start flex-md-self-center";
  button.style.marginLeft = "8px";
  button.style.textDecoration = "none";

  const span = document.createElement("span");
  span.style.display = "flex";
  span.style.alignItems = "center";
  span.style.justifyContent = "space-between";
  span.style.flexDirection = "row";
  span.title = "Loading...";
  span.className = `js-flywheel-draft-pr-step State`;

  span.appendChild(createLoaderDiv());

  const label = document.createElement("div");
  label.textContent = `${capitaliseFirstLetter(branch)}`;
  label.style.marginLeft = "8px";
  span.appendChild(label);
  button.appendChild(span);

  return button;
}

export function createAuthorBranchLabel(
  author: string,
  fromBranchAlias: string,
  githubUser: string
) {
  const id = `who-is-in-branch-${fromBranchAlias}`;
  let button = document.getElementById(id) as HTMLAnchorElement;
  if (button) {
    button.remove();
  }

  button = document.createElement("a");
  button.id = id;

  button.className = "flex-shrink-0 flex-self-start flex-md-self-center";
  button.style.marginLeft = "8px";
  // https://github.com/AuroraEnergyResearch/energy-storage-dispatch-service/compare/main...staging

  button.style.textDecoration = "none";

  const [color, title, svg] = (() => {
    if (!author) {
      return ["open", `No one in ${fromBranchAlias}`, createGitCompareIcon()];
    } else if (author === githubUser) {
      return [
        "merged",
        `You are in ${fromBranchAlias}`,
        createGitCompareIcon(),
      ];
    } else {
      return [
        "closed",
        `${author} in ${fromBranchAlias}`,
        createGitPullRequestClosedIcon(),
      ];
    }
  })();

  const span = document.createElement("span");
  span.style.display = "flex";
  span.style.alignItems = "center";
  span.style.justifyContent = "space-between";
  span.style.flexDirection = "row";
  span.title = title;
  span.className = `js-flywheel-draft-pr-step State State--${color}`;

  span.appendChild(svg);

  const label = document.createElement("div");
  label.textContent = `${capitaliseFirstLetter(fromBranchAlias)}`;
  label.style.marginLeft = "8px";
  span.appendChild(label);
  button.appendChild(span);

  return button;
}
