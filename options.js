document.getElementById("save").addEventListener("click", function () {
  let token = document.getElementById("token").value;
  chrome.storage.sync.set({ GITHUB_TOKEN: token }, function () {
    console.log("Credentials saved");
    alert("Credentials saved");
  });
});

// Get all checkboxes
let checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Add event listener to each checkbox
checkboxes.forEach((checkbox) => {
  chrome.storage.sync.get([checkbox.id], (r) => {
    checkbox.checked = !r[checkbox.id];
  });

  checkbox.addEventListener("change", function () {
    // Set the feature status in Chrome storage
    // if set to true feature is disabled (all features enabled by default)
    chrome.storage.sync.set({ [checkbox.id]: !checkbox.checked }, function () {
      console.log(
        `${checkbox.id} is ${!checkbox.checked ? "disabled" : "enabled"}`
      );
    });
  });
});

let storageElements = document.querySelectorAll(".storage-sync");

// Add event listener to each storage sync element
storageElements.forEach((element) => {
  // currently only supports text input elements
  if (element.tagName.toLowerCase() === "input" && element.type === "text") {
    chrome.storage.sync.get([element.id], (r) => {
      element.value = r[element.id];
    });

    checkbox.addEventListener("change", function () {
      chrome.storage.sync.set({ [element.id]: element.value }, function () {
        console.log(`${checkbox.id} set to ${element.value}`);
      });
    });
  }
});
