import React from "react";
import ValidLaunchIcon from "./components/ValidLaunchIcon";
import ValidSocialsIcon from "./components/ValidSocialsIcon";
import UniqueSocialsIcon from "./components/UniqueSocialsIcon";
import PumpDumpIcon from "./components/PumpDumpIcon";
import InfoIcon from "./components/InfoIcon";
import WalletIcon from "./components/WalletIcon";
import PriceWarningIcon from "./components/PriceWarningIcon";

const DecorHeader = ({
  recentCSolVal,
  recentTotalFee,
  max_cactor_rank,
  recentActorRank,
  dex_paid,
  valid_launch,
  valid_socials,
  unique_socials,
  bullx,
  bundle_ratio,
  pump_dump_risk,
  total_comments,
  migrated,
  name,
  symbol,
  image,
  id,
  hv_wallets_count,
  hv_holdings,
  hv_avg_profit_only,
  fresh_creator_wallet,
  creator,
  recentHt,
  recentClose,
  timeDuration,
}) => {
  // If migrated is true, force all colors to gray
  const isGray = Boolean(migrated);

  // Helper to pick "red/orange/green" based on thresholds;
  // but override to gray if isGray===true
  const getColor = (value, { low, high }) => {
    if (isGray) return "gray";
    if (value < low) return "red";
    if (value < high) return "orange";
    return "green";
  };

  // Convert to numbers (in case props arrive as strings)
  const volumeNum = Number(recentCSolVal) || 0;
  const mcarNum = Number(max_cactor_rank) || 0;
  const actorRankNum = Math.round(Number(recentActorRank) || 0);
  const htNum = Number(recentHt) || 0;

  // Compute colors/styles, but override to gray if isGray
  const volumeColor = getColor(volumeNum, { low: 200, high: 400 });
  const mcarColor = getColor(mcarNum, { low: 200, high: 400 });
  const arColor = getColor(actorRankNum, { low: 200, high: 400 });

  // HT styling
  let htColor = "black";
  if (!isGray) {
    if (htNum > 0.4) htColor = "red";
    else if (htNum < 0.25) htColor = "green";
  } else {
    htColor = "gray";
  }

  // Actor‐rank gets bold only if not migrated and >520
  const arStyle = isGray
    ? {}
    : actorRankNum > 520
    ? { fontWeight: "bold" }
    : {};

  // A helper to apply gray to each <p> if migrated
  const pStyle = {
    margin: 0,
    color: isGray ? "gray" : undefined,
  };

  // Determine if loading should be shown (any of name, symbol, or image missing)
  const isLoading = !name || !symbol || !image;

  // Shorten the id for display: first 4 chars + "..." + last 4 chars
  const shortId = id ? `${id.slice(0, 4)}...${id.slice(id.length - 4)}` : "";

  // Handler to copy the full id to the clipboard
  const handleCopyId = () => {
    if (id) {
      navigator.clipboard.writeText(id);
    }
  };

  return (
    <div className="card-header" style={{ fontSize: "12px" }}>
      {/* Show "token migrated" badge when migrated is true */}
      {isGray && (
        <div className="mb-2">
          <span className="badge bg-warning text-dark">token migrated</span>
        </div>
      )}

      {/* 4-Column Data Layout */}
      <div className="row">
        {/* Column 1: Trading Metrics */}
        <div className="col-3">
          <div className="mb-1">
            <strong style={pStyle}>Trading Metrics</strong>
          </div>
          <div className="mb-1">
            <span style={{ color: isGray ? "gray" : "gray" }}>VOL:</span>{" "}
            <span style={{ color: volumeColor, fontWeight: "bold" }}>
              {recentCSolVal}
            </span>
          </div>
          {recentTotalFee && (
            <div className="mb-1">
              <span style={{ color: isGray ? "gray" : "gray" }}>Total Fee:</span>{" "}
              <span style={{ fontWeight: "bold", color: isGray ? "gray" : undefined }}>
                {recentTotalFee}
              </span>
            </div>
          )}
          {recentTotalFee && recentCSolVal && (
            <div className="mb-1">
              <span className="d-inline-flex align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-cone-striped me-1"
                  viewBox="0 0 16 16"
                  style={{ color: isGray ? "gray" : undefined }}
                >
                  <path d="m9.97 4.88.953 3.811C10.159 8.878 9.14 9 8 9s-2.158-.122-2.923-.309L6.03 4.88C6.635 4.957 7.3 5 8 5s1.365-.043 1.97-.12zm-.245-.978L8.97.88C8.718-.13 7.282-.13 7.03.88L6.275 3.9C6.8 3.965 7.382 4 8 4s1.2-.036 1.725-.098zm4.396 8.613a.5.5 0 0 1 .037.96l-6 2a.5.5 0 0 1-.316 0l-6-2a.5.5 0 0 1 .037-.96l2.391-.598.565-2.257c.862.212 1.964.339 3.165.339s2.303-.127 3.165-.339l.565 2.257z" />
                </svg>
                <span style={{ color: isGray ? "gray" : "gray" }}>FRI:</span>{" "}
                <span style={{ fontWeight: "bold", marginLeft: "4px", color: isGray ? "gray" : undefined }}>
                  {Number(recentCSolVal) !== 0
                    ? (Number(recentTotalFee) / Number(recentCSolVal)).toFixed(4)
                    : "N/A"}
                </span>
              </span>
            </div>
          )}
          {recentHt && (
            <div className="mb-1">
              <span style={{ color: isGray ? "gray" : "gray" }}>HT:</span>{" "}
              <span style={{ fontWeight: "bold", color: htColor }}>
                {recentHt}
              </span>
              <PriceWarningIcon closePrice={recentClose} />
            </div>
          )}
          {bullx !== undefined && (
            <div className="mb-1">
              <span style={{ color: isGray ? "gray" : "gray" }}>BullX:</span>{" "}
              <span style={{ fontWeight: "bold", color: isGray ? "gray" : undefined }}>
                {bullx}
              </span>
            </div>
          )}
        </div>

        {/* Column 2: Wallet Analytics */}
        <div className="col-3">
          <div className="mb-1">
            <strong style={pStyle}>Wallet Analytics</strong>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span style={{ color: isGray ? "gray" : "gray" }}>OS:</span>
            <span style={{ color: arColor, fontWeight: "bold", marginLeft: 4 }}>
              {actorRankNum}
            </span>
            <span style={{ color: isGray ? "gray" : "gray", marginLeft: 2 }}>
              ({Math.round(mcarNum)})
            </span>
            <InfoIcon text="Token Onchain Score: Current (Max)" />
          </div>
          {hv_wallets_count !== undefined && (
            <div className="mb-1">
              <span style={{ color: isGray ? "gray" : "gray" }}>HV Wallets:</span>{" "}
              <span style={{ fontWeight: "bold", color: isGray ? "gray" : undefined }}>
                {Number(hv_wallets_count).toFixed(0)}
              </span>
            </div>
          )}
          {hv_holdings !== undefined && (
            <div className="mb-1">
              <span style={{ color: isGray ? "gray" : "gray" }}>HV Holdings:</span>{" "}
              <span style={{ fontWeight: "bold", color: isGray ? "gray" : undefined }}>
                {Number(hv_holdings).toFixed(2)}
              </span>
            </div>
          )}
          {hv_avg_profit_only !== undefined && (
            <div className="mb-1">
              <span style={{ color: isGray ? "gray" : "gray" }}>HV Avg Profit:</span>{" "}
              <span style={{ fontWeight: "bold", color: isGray ? "gray" : undefined }}>
                {Number(hv_avg_profit_only).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Column 3: Status & Indicators */}
        <div className="col-3">
          <div className="mb-1">
            <strong style={pStyle}>Status & Indicators</strong>
          </div>
          {timeDuration && (
            <div className="mb-1">
              <span className="d-inline-flex align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-stopwatch me-1"
                  viewBox="0 0 16 16"
                  style={{ color: isGray ? "gray" : undefined }}
                >
                  <path d="M8.5 5.6a.5.5 0 1 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8.5 8.664z" />
                  <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 1.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3" />
                </svg>
                <span style={{ fontWeight: "bold", color: isGray ? "gray" : "gray" }}>
                  {timeDuration}
                </span>
              </span>
            </div>
          )}
          <div className="d-flex flex-wrap gap-1 align-items-center">
            {dex_paid && (
              <span className="badge bg-success" style={{ filter: isGray ? "grayscale(100%)" : "none" }}>
                dex paid
              </span>
            )}
            {bundle_ratio > 0.01 && (
              <span className="badge text-bg-warning" style={{ filter: isGray ? "grayscale(100%)" : "none" }}>
                Bundle:{Math.round(bundle_ratio * 100)}%
              </span>
            )}
            {total_comments > 0 && (
              <span className="badge text-bg-light align-middle">
                <img
                  src="/pflogo.png"
                  alt="pump.fun Logo"
                  style={{
                    height: "12px",
                    width: "auto",
                    marginRight: "2px",
                    filter: isGray ? "grayscale(100%)" : "none",
                  }}
                />
                {total_comments}
              </span>
            )}
          </div>
          <div className="d-flex flex-wrap gap-1 align-items-center mt-2" style={{ filter: isGray ? "grayscale(100%)" : "none" }}>
            {valid_launch === false && <ValidLaunchIcon />}
            {pump_dump_risk === true && <PumpDumpIcon />}
            {!valid_socials && <ValidSocialsIcon />}
            {!unique_socials && <UniqueSocialsIcon />}
            <WalletIcon
              fresh_creator_wallet={fresh_creator_wallet}
              creator={creator}
            />
          </div>
        </div>

        {/* Column 4: Token Image */}
        <div className="col-3">
          <div className="d-flex align-items-center justify-content-center h-100">
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                {/* Circular Token Image */}
                <img
                  src={image}
                  alt={`${name} logo`}
                  className="rounded-circle me-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    filter: isGray ? "grayscale(100%)" : "none",
                  }}
                />

                {/* Name, Symbol, and Shortened ID with Copy Icon */}
                <div className="text-start">
                  <h5
                    style={{
                      color: isGray ? "gray" : undefined,
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {name}
                  </h5>
                  <p
                    style={{
                      color: isGray ? "gray" : undefined,
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {symbol}
                  </p>
                  <div className="d-flex align-items-center">
                    <p
                      style={{
                        color: isGray ? "gray" : undefined,
                        margin: 0,
                        lineHeight: 1.2,
                        fontSize: "12px",
                      }}
                    >
                      {shortId}
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="btn btn-sm btn-link p-0 ms-2"
                      title="Copy full ID"
                      style={{ color: isGray ? "gray" : undefined }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-copy"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecorHeader;
