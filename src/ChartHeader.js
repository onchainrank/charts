import React from "react";

const ChartHeader = ({
  chartId,
  name,
  symbol,
  recentCSolVal,
  recentTotalFee,
  timeDuration,
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
      {/* Middle: Name, Symbol, recent cSolVal, total fee, and time duration */}
      <div>
        <span>Name: {name}</span> | <span>Symbol: {symbol}</span> |{" "}
        <span>cSolVal: {recentCSolVal}</span> |{" "}
        <span>Total Fee: {recentTotalFee}</span>
        {timeDuration && (
          <>
            {" | "}
            <span className="d-inline-flex align-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-stopwatch me-1"
                viewBox="0 0 16 16"
              >
                <path d="M8.5 5.6a.5.5 0 1 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8.5 8.664z"/>
                <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 1.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3"/>
              </svg>
              {timeDuration}
            </span>
          </>
        )}
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
