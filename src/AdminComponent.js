import React from "react";

export default function AdminComponent({ id, token }) {
  const handleClick = async () => {
    if (!token) {
      console.warn("No token provided");
      return;
    }

    try {
      const response = await fetch(
        `https://profile.onchainrank.com/marketing-addr/${token}/${id}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();
      console.log("API response:", data);

      if (data.token_ticker) {
        try {
          await navigator.clipboard.writeText(
            "onchainrank.com/" + data.token_ticker
          );
          console.log(`Copied to clipboard: ${data.token_ticker}`);
        } catch (clipError) {
          console.error("Clipboard write failed:", clipError);
        }
      } else {
        console.warn("token_ticker not found in response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: 0,
        margin: 0,
        border: "none",
        background: "none",
        lineHeight: 0, // removes extra vertical spacing
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-folder-symlink"
        viewBox="0 0 16 16"
      >
        <path d="m11.798 8.271-3.182 1.97c-.27.166-.616-.036-.616-.372V9.1s-2.571-.3-4 2.4c.571-4.8 3.143-4.8 4-4.8v-.769c0-.336.346-.538.616-.371l3.182 1.969c.27.166.27.576 0 .742" />
        <path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m.694 2.09A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09l-.636 7a1 1 0 0 1-.996.91H2.826a1 1 0 0 1-.995-.91zM6.172 2a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z" />
      </svg>
    </button>
  );
}
