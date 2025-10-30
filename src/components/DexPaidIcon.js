import React from "react";

const DexPaidIcon = () => (
  <span
    title="DEX listing fee has been paid - verified liquidity pool"
    style={{
      cursor: "help",
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "#000000",
      borderRadius: "8px",
      padding: "4px",
      width: "25px",
      height: "25px",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <img
      src="/figma-assets/icons/dexpaid.svg"
      alt="DEX Paid"
      style={{ width: "17px", height: "17px", display: "block" }}
    />
  </span>
);

export default DexPaidIcon;
