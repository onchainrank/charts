// background.js

// Global variable to store the API key
let authKey = "";

// Retrieve the API key when the service worker starts
chrome.storage.local.get(["apiKey"], (result) => {
  if (result.apiKey) {
    authKey = result.apiKey;
    console.log("Auth key loaded:", authKey);
  }
});

// Listen for changes to the API key and update the global variable
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.apiKey) {
    authKey = changes.apiKey.newValue;
    console.log("Auth key updated:", authKey);
  }
});

// Intercept requests to the target URL and add the Authorization header
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (authKey) {
      details.requestHeaders.push({
        name: "Authorization",
        value: authKey,
      });
      console.log("Authorization header added:", authKey);
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["http://localhost:3000/single/*"] },
  ["blocking", "requestHeaders", "extraHeaders"]
);
