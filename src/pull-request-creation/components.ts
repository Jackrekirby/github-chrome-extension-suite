import { UPDATE_PR_DETAILS_BACKGROUND_ACTION } from "./tools";

export function getPrBranchElements() {
  return document.querySelectorAll(
    ".commit-ref.css-truncate.user-select-contain.expandable .css-truncate-target"
  );
}

export function buildCreatePrOnClick(
  fromBranch: string,
  toBranch: string,
  title: string,
  description: string
) {
  return async () => {
    const repoPath = window.location.pathname.split("/").slice(1, 3).join("/");

    const url = `https://github.com/${repoPath}/compare/${toBranch}...${fromBranch}?expand=1`;

    chrome.runtime.sendMessage({
      action: UPDATE_PR_DETAILS_BACKGROUND_ACTION,
      url,
      title,
      description,
    });
  };
}

export function truncateWithEllipses(text: string, maxCharCount: number = 12) {
  if (text.length > maxCharCount) {
    let truncatedText = text.substring(0, maxCharCount);
    let lastSpaceIndex = truncatedText.lastIndexOf(" ");
    let lastUnderscoreIndex = truncatedText.lastIndexOf("_");
    let lastDashIndex = truncatedText.lastIndexOf("-");
    let cutIndex = Math.max(lastSpaceIndex, lastUnderscoreIndex, lastDashIndex);
    if (cutIndex === -1) cutIndex = maxCharCount; // no space, underscore, or dash found
    return text.substring(0, cutIndex) + "...";
  } else {
    return text;
  }
}

export function svgCopy() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "height", "16");
  svg.setAttributeNS(null, "width", "16");
  svg.setAttributeNS(null, "viewBox", "0 0 512 512");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttributeNS(
    null,
    "d",
    "M64 464H288c8.8 0 16-7.2 16-16V384h48v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16zM224 304H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H224c-8.8 0-16 7.2-16 16V288c0 8.8 7.2 16 16 16zm-64-16V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64z"
  );

  svg.appendChild(path);
  return svg;
}

export function svgNew() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "height", "16");
  svg.setAttributeNS(null, "width", "16");
  svg.setAttributeNS(null, "viewBox", "0 0 512 512");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttributeNS(
    null,
    "d",
    "M305.8 2.1C314.4 5.9 320 14.5 320 24V64h16c70.7 0 128 57.3 128 128V358.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V192c0-35.3-28.7-64-64-64H320v40c0 9.5-5.6 18.1-14.2 21.9s-18.8 2.3-25.8-4.1l-80-72c-5.1-4.6-7.9-11-7.9-17.8s2.9-13.3 7.9-17.8l80-72c7-6.3 17.2-7.9 25.8-4.1zM104 80A24 24 0 1 0 56 80a24 24 0 1 0 48 0zm8 73.3V358.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80c0 32.8-19.7 61-48 73.3zM104 432a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zm328 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"
  );

  svg.appendChild(path);

  return svg;
}

export function createButton(
  text: string,
  onclick: () => void,
  svg: SVGSVGElement
) {
  const button = document.createElement("button");
  button.setAttribute(
    "class",
    "Button--secondary Button--small Button Button--fullWidth"
  );
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.marginTop = "8px";
  button.onclick = onclick;

  const p = document.createElement("p");
  p.textContent = text;
  p.style.margin = "0px 0px 0px 8px";

  button.appendChild(svg);
  button.appendChild(p);

  return button;
}

export function replaceFirstMatchingWord(
  input: string,
  replacement: string,
  wordsToReplace: string[]
): string {
  // replace the first word that matches
  for (const word of wordsToReplace) {
    const regex = new RegExp(word, "gi"); // "g" for global, "i" for case insensitive
    const output = input.replace(regex, replacement);
    if (output !== input) {
      return output;
    }
  }

  return input;
}
