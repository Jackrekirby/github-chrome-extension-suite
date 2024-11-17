export const CreateBranchTransitionElement = (
  recognisedBranchTransition: boolean
) => {
  const warnElement = document.createElement("div");
  if (recognisedBranchTransition) {
    warnElement.textContent = "Recognised Transition";
    warnElement.style.color = "var(--borderColor-success-emphasis)";
    warnElement.style.backgroundColor = "var(--bgColor-success-muted)";
  } else {
    warnElement.textContent = "Unknown Transition";
    warnElement.style.color = "var(--bgColor-danger-emphasis)";
    warnElement.style.backgroundColor = "var(--bgColor-danger-muted)";
  }

  warnElement.style.display = "inline-block";
  warnElement.style.padding = "0 var(--base-size-4)";
  warnElement.style.font =
    ".85em/1.8 var(--fontStack-monospace, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace)";
  warnElement.style.borderRadius = "var(--borderRadius-medium)";
  return warnElement;
};
