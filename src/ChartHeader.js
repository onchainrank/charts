import React from "react";

const ChartHeader = ({
  chartId,
  name,
  symbol,
  recentCSolVal,
  recentTotalFee,
  image,
  handleCopy,
  handleDelete,
}) => {
  return (
    <div className="card-header d-flex justify-content-between align-items-center">
      {/* Left: Display image (if available), then truncated Chart ID and copy icon */}
      <div className="d-flex align-items-center">
        {image && (
          <img
            src={image}
            alt="chart logo"
            style={{ height: "128px", width: "auto", marginRight: "10px" }}
          />
        )}
        <span>Chart: {chartId.substring(0, 4)}</span>
        <span
          onClick={handleCopy}
          style={{ cursor: "pointer", marginLeft: "5px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-copy"
            viewBox="0 0 16 16"
            style={{ maxHeight: "5px" }}
          >
            <path
              fillRule="evenodd"
              d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
            />
          </svg>
        </span>
      </div>
      {/* Middle: Name, Symbol, recent cSolVal, and total fee */}
      <div>
        <span>Name: {name}</span> | <span>Symbol: {symbol}</span> |{" "}
        <span>cSolVal: {recentCSolVal}</span> |{" "}
        <span>Total Fee: {recentTotalFee}</span>
      </div>
      {/* Right: Delete icon */}
      <div>
        <span onClick={handleDelete} style={{ cursor: "pointer" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="red"
            className="bi bi-patch-minus-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zM6 7.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default ChartHeader;
