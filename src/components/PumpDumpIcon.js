import React from "react";

const PumpDumpIcon = ({ size = "normal" }) => {
  // normal size is 25% smaller than original (25px), small is 50% of normal
  const dimensions = size === "small" ? 14 : 19;

  return (
    <>
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            fill: blue;
          }
          50% {
            fill: orange;
          }
        }
        .blinking-icon {
          animation: blink 1s infinite ease-in-out;
        }
      `}</style>

      <span
        title="High risk of pump dump scheme"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: `${dimensions}px`,
          height: `${dimensions}px`,
          flexShrink: 0,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={dimensions}
          height={dimensions}
          fill="currentColor"
          className="bi bi-arrow-down-up blinking-icon"
          viewBox="0 0 16 16"
        >
          <path
            transform="translate(0,16) scale(1,-1)"
            fillRule="evenodd"
            d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
          />
        </svg>
      </span>
    </>
  );
};

export default PumpDumpIcon;
