(function () {
  // Extract the "address" parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const address = urlParams.get("address");
  if (!address) {
    console.log("No address parameter found.");
    return;
  }

  // Build the OnChainRank website URL using the extracted address
  const onChainRankUrl = `http://localhost:3000/single/${address}`;

  let currentIframe = null;
  let pollIntervalId = null;

  // Create a new iframe element configured with the target URL
  function createIframe() {
    const iframe = document.createElement("iframe");
    iframe.src = onChainRankUrl;
    iframe.style.width = "100%";
    iframe.style.height = "400px"; // Maximum height of 200px
    iframe.style.border = "none";
    iframe.style.display = "block";
    return iframe;
  }

  // Inject the iframe between the two target divs if it is not already injected
  function injectIframe() {
    if (currentIframe !== null) {
      return; // Already injected
    }
    const firstDiv = document.querySelector(
      ".not-tv-chart.bg-grey-900.rounded-\\[2px\\].border-t.border-grey-500.relative"
    );
    const secondDiv = document.querySelector(
      ".ant-tabs.ant-tabs-top.ant-tabs-middle.flex.flex-col.flex-1.terminal-tabs.bg-grey-900.overflow-hidden.md\\:h-full.md\\:max-h-full.pt-1.z-50"
    );
    if (firstDiv && secondDiv) {
      currentIframe = createIframe();
      firstDiv.parentNode.insertBefore(currentIframe, secondDiv);
      console.log("Iframe injected.");
    }
  }

  // Remove the iframe from the DOM and set the reference to null
  function removeIframe() {
    if (currentIframe) {
      currentIframe.remove();
      currentIframe = null;
      console.log("Iframe removed.");
    }
  }

  // Start polling to check for target elements if they are not yet available
  function startPolling() {
    pollIntervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        injectIframe();
        if (currentIframe) {
          clearInterval(pollIntervalId);
          pollIntervalId = null;
        }
      }
    }, 500);
  }

  // Initial poll to inject the iframe on page load
  startPolling();

  // Listen for visibility changes (i.e., tab switching)
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      // When the tab is hidden, remove the iframe to close the websocket connection.
      removeIframe();
      console.log("Tab hidden: iframe removed.");
    } else if (document.visibilityState === "visible") {
      // When the tab becomes visible again, re-inject the iframe.
      injectIframe();
      // If the target containers are not yet available, restart polling.
      if (!currentIframe) {
        startPolling();
      }
      console.log("Tab visible: iframe injected if container available.");
    }
  });
})();
