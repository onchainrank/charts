(function () {
  // Extract the "address" parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const address = urlParams.get("address");
  if (!address) {
    console.log("No address parameter found.");
    return;
  }

  // Build the bullx website URL using the extracted address
  const bullxUrl = `http://localhost:3000/single/${address}`;

  // Create an iframe element to load the bullx website
  const iframe = document.createElement("iframe");
  iframe.src = bullxUrl;
  iframe.style.width = "100%";
  iframe.style.height = "480px"; // Adjust the height as needed
  iframe.style.border = "none";
  iframe.style.display = "block";

  // Function to check for target elements and inject the iframe
  function tryInject() {
    // Select the first target div (escape special characters)
    const firstDiv = document.querySelector(
      ".not-tv-chart.bg-grey-900.rounded-\\[2px\\].border-t.border-grey-500.relative"
    );
    // Select the second target div (escape special characters)
    const secondDiv = document.querySelector(
      ".ant-tabs.ant-tabs-top.ant-tabs-middle.flex.flex-col.flex-1.terminal-tabs.bg-grey-900.overflow-hidden.md\\:h-full.md\\:max-h-full.pt-1.z-50"
    );

    // If both elements are found, inject the iframe and return true
    if (firstDiv && secondDiv) {
      firstDiv.parentNode.insertBefore(iframe, secondDiv);
      console.log("Iframe successfully injected between target divs.");
      return true;
    }
    return false;
  }

  // Poll every 500ms to check if the elements have been rendered
  const intervalId = setInterval(() => {
    if (tryInject()) {
      clearInterval(intervalId); // Stop polling once injected
    }
  }, 500);
})();
