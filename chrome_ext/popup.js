document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("apiKey");
  const saveBtn = document.getElementById("saveBtn");

  // Load the saved API key from storage, if any
  chrome.storage.local.get(["apiKey"], function (result) {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  });

  // Save the API key to storage on button click
  saveBtn.addEventListener("click", function () {
    const apiKey = apiKeyInput.value;
    chrome.storage.local.set({ apiKey: apiKey }, function () {
      alert("API key saved!");
    });
  });
});
