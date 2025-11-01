import React from "react";

const DataUnavailable = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f7faff",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 24px",
            backgroundColor: "rgba(251, 191, 36, 0.08)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
              fill="#F59E0B"
            />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "28px",
            fontWeight: "700",
            color: "#1a1a1a",
            marginBottom: "16px",
          }}
        >
          Data Unavailable
        </h1>

        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "16px",
            fontWeight: "400",
            color: "#555555",
            marginBottom: "24px",
            lineHeight: "1.6",
          }}
        >
          Chart data is currently unavailable. This token may not exist or data has not been collected yet.
        </p>

        <button
          onClick={() => window.location.reload()}
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "16px",
            fontWeight: "600",
            color: "#ffffff",
            backgroundColor: "#1e3a8a",
            padding: "12px 32px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#1e40af";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#1e3a8a";
          }}
        >
          Reload Page
        </button>

        <div
          style={{
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: "400",
              color: "#6b7280",
              marginBottom: "8px",
            }}
          >
            Need help?
          </p>
          <a
            href="https://t.me/onchain_rank"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: "500",
              color: "#1e3a8a",
              textDecoration: "none",
            }}
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default DataUnavailable;
