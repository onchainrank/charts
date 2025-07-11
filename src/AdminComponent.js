import React, { useState } from "react";

export default function AdminComponent({ id, token }) {
  const [address, setAddress] = useState(null);

  const handleFetch = async () => {
    if (!token || !id) {
      console.warn("Missing token or id");
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

      if (data.address) {
        setAddress("onchainrank.com/" + data.token_ticker);
      } else {
        console.warn("No address field in response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <div>
      {/* Icon button that triggers data fetch */}
      <button
        onClick={handleFetch}
        style={{
          padding: 0,
          margin: 0,
          border: "none",
          background: "none",
          lineHeight: 0,
          cursor: "pointer",
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

      {/* Once `address` is set, show a clickable link */}
      {address && (
        <div style={{ marginTop: "8px" }}>
          <span>{address}</span>
        </div>
      )}
    </div>
  );
}
