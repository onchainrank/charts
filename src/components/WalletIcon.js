import React from "react";

const WalletIcon = ({ fresh_creator_wallet, creator }) => {
  const getColor = () => {
    if (fresh_creator_wallet === true) return "red";
    if (fresh_creator_wallet === false) return "green";
    return "#d3d3d3"; // light gray for null/undefined
  };

  const handleClick = () => {
    if (creator) {
      const solscanUrl = `https://solscan.io/account/${creator}#defiactivities`;
      window.open(solscanUrl, "_blank");
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill={getColor()}
      className="bi bi-wallet-fill"
      viewBox="0 0 16 16"
      style={{ 
        marginRight: "8px", 
        cursor: creator ? "pointer" : "default" 
      }}
      onClick={handleClick}
      title={creator ? "View on Solscan" : ""}
    >
      <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v2h6a.5.5 0 0 1 .5.5c0 .253.08.644.306.958.207.288.557.542 1.194.542s.987-.254 1.194-.542C9.42 6.644 9.5 6.253 9.5 6a.5.5 0 0 1 .5-.5h6v-2A1.5 1.5 0 0 0 14.5 2z"/>
      <path d="M16 6.5h-5.551a2.7 2.7 0 0 1-.443 1.042C9.613 8.088 8.963 8.5 8 8.5s-1.613-.412-2.006-.958A2.7 2.7 0 0 1 5.551 6.5H0v6A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5z"/>
    </svg>
  );
};

export default WalletIcon;