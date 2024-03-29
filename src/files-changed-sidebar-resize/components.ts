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

export const observeValueChange = <T>(initialValue: T) => {
  let currentValue = initialValue;
  return (newValue: T) => {
    const hasChanged = currentValue !== newValue;
    currentValue = newValue;
    return hasChanged;
  };
};
