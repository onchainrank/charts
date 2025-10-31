import React from "react";

const PumpFunIcon = ({ count, size = "normal" }) => {
  // normal size is 25% smaller than original (25px), small is 50% of normal
  const dimensions = size === "small" ? 24 : 29;
  const innerDimensions = size === "small" ? 20 : 34;
  const fontSize = size === "small" ? "9px" : "11.28px";

  return (
    <div
      title={`Total comments on pump.fun: ${count}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: size === "small" ? "1px" : "1.4px",
        cursor: "help",
      }}
    >
      <div
        className="social-icon-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          width: `${dimensions}px`,
          height: `${dimensions}px`,
          padding: size === "small" ? "2px" : "4px",
          backgroundColor: "rgba(96, 203, 135, 0.28)",
        }}
      >
        <div
          className="social-icon-inner"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: `${innerDimensions}px`,
            height: `${innerDimensions}px`,
            borderRadius: "50%",
            backgroundColor: "#60cb87",
          }}
        >
          <img
            src="/pflogo.png"
            alt="pump.fun icon"
            style={{
              width: `${size === "small" ? 11 : 19.94}px`,
              height: `${size === "small" ? 11 : 19.94}px`,
            }}
          />
        </div>
      </div>
      <span
        className="social-count"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: "500",
          fontSize: fontSize,
          lineHeight: size === "small" ? "12px" : "17px",
          color: "#555555",
        }}
      >
        {count}
      </span>
    </div>
  );
};

export default PumpFunIcon;
