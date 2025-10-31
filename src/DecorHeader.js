import React from "react";
import ValidLaunchIcon from "./components/ValidLaunchIcon";
import ValidSocialsIcon from "./components/ValidSocialsIcon";
import UniqueSocialsIcon from "./components/UniqueSocialsIcon";
import PumpDumpIcon from "./components/PumpDumpIcon";
import InfoIcon from "./components/InfoIcon";
import WalletIcon from "./components/WalletIcon";
import PriceWarningIcon from "./components/PriceWarningIcon";
import DexPaidIcon from "./components/DexPaidIcon";
import "./DashboardStyles.css";

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
  const recentFri =
    recentTotalFee && recentTotalFee > 0 ? recentTotalFee / recentCSolVal : 0;
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

  const arStyle = isGray
    ? {}
    : actorRankNum > 520
    ? { fontWeight: "bold" }
    : {};

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

  // Format HV Avg Profit
  const formatHvAvgProfit = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "0";

    if (num < 100) {
      return Math.round(num).toString();
    } else if (num < 200) {
      return `${Math.floor(num / 10) * 10}+`;
    } else if (num < 300) {
      return "200+";
    } else if (num < 500) {
      return `${Math.floor(num / 50) * 50}+`;
    } else {
      return "500+";
    }
  };

  // Format HV Holdings as percentage
  const formatHvHoldings = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "0%";
    return `${(num * 100).toFixed(0)}%`;
  };

  return (
    <div className="card-header" style={{ padding: "20px" }}>
      {/* Token Header with Image, Name, Symbol */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          {isLoading ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <>
              <img
                src={image}
                alt={`${name} logo`}
                className="rounded-circle me-3"
                style={{
                  width: "64px",
                  height: "64px",
                  objectFit: "cover",
                  filter: isGray ? "grayscale(100%)" : "none",
                }}
              />
              <div>
                <h4
                  className="decor-logo-text"
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: isGray ? "gray" : "#1e3a8a",
                  }}
                >
                  {name}{" "}
                  <span style={{ color: isGray ? "gray" : "#6b7280" }}>
                    ({symbol})
                  </span>
                </h4>
                <div className="d-flex align-items-center mt-1">
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    {shortId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="btn btn-sm btn-link p-0 ms-2"
                    title="Copy full ID"
                    style={{ color: isGray ? "gray" : "#6b7280" }}
                  >
                    <img
                      src="/figma-assets/icons/Copy.svg"
                      alt="Copy"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Show "token migrated" badge when migrated is true */}
        {isGray && (
          <span
            className="badge bg-warning text-dark"
            style={{ fontSize: "14px", padding: "8px 16px" }}
          >
            Token Migrated
          </span>
        )}
      </div>

      {/* Dashboard Metrics Grid */}
      <div className="decor-metrics-grid">
        {/* Volume Metric */}
        <div className="decor-metric-card">
          <div className="decor-metric-content">
            <div className="decor-metric-info">
              <span className="decor-metric-label">VOL</span>
              <span
                id="recentCSolVal"
                className={`decor-metric-value ${isGray ? "" : volumeColor}`}
              >
                {recentCSolVal}
              </span>
            </div>
            <div className="decor-metric-icon decor-icon-blue-bg">
              <img
                src="/figma-assets/icons/Dollar Minimalistic.svg"
                alt="Volume"
              />
            </div>
          </div>
        </div>
        {/* Onchain Score Metric */}
        <div className="decor-metric-card">
          <div className="decor-metric-content">
            <div className="decor-metric-info">
              <span className="decor-metric-label">OS</span>
              <div className="d-flex align-items-center">
                <span
                  id="recentActorRank"
                  className={`decor-metric-value ${isGray ? "" : arColor}`}
                >
                  {actorRankNum}
                </span>
                <span id="max_cactor_rank" className="decor-metric-subvalue">
                  ({Math.round(mcarNum)})
                </span>
                <InfoIcon text="Token Onchain Score: Current (Max)" />
              </div>
            </div>
            <div className="decor-metric-icon decor-icon-mint-bg">
              <img src="/figma-assets/icons/Graph New Up.svg" alt="Score" />
            </div>
          </div>
        </div>
        {/* Total Fee Metric */}
        {recentTotalFee && (
          <div className="decor-metric-card">
            <div className="decor-metric-content">
              <div className="decor-metric-info">
                <span className="decor-metric-label">Total Fee</span>
                <span
                  id="recentTotalFee"
                  className="decor-metric-value"
                  style={{ color: isGray ? "gray" : "#1a1a1a" }}
                >
                  {recentTotalFee}
                </span>
              </div>
              <div className="decor-metric-icon decor-icon-yellow-bg">
                <img src="/figma-assets/icons/wallet.svg" alt="Fee" />
              </div>
            </div>
          </div>
        )}
        {/* HT Metric */}
        {recentHt && (
          <div className="decor-metric-card">
            <div className="decor-metric-content">
              <div className="decor-metric-info">
                <span className="decor-metric-label">HT</span>
                <div className="d-flex align-items-center">
                  <span
                    id="recentHt"
                    className={`decor-metric-value`}
                    style={{ color: isGray ? "gray" : htColor }}
                  >
                    {recentHt}
                  </span>
                  <PriceWarningIcon closePrice={recentClose} size="normal" />
                </div>
              </div>
              <div className="decor-metric-icon decor-icon-peach-bg">
                <img src="/figma-assets/icons/Flame-1.svg" alt="HT" />
              </div>
            </div>
          </div>
        )}
        <div className="decor-metric-card">
          <div className="decor-metric-content">
            <div className="decor-metric-info">
              <span className="decor-metric-label">FRI</span>
              <span id="recentFri" className="decor-metric-value">
                {Number(recentFri) !== 0 ? recentFri.toFixed(4) : "N/A"}
              </span>
            </div>
            <div className="decor-metric-icon decor-icon-purple-bg">
              <img src="/figma-assets/icons/Flame.svg" alt="FRI" />
            </div>
          </div>
        </div>
        {/* Time Duration Metric */}
        {timeDuration && (
          <div className="decor-metric-card">
            <div className="decor-metric-content">
              <div className="decor-metric-info">
                <span className="decor-metric-label">Created</span>
                <span
                  id="timeDuration"
                  className="decor-metric-value"
                  style={{ color: isGray ? "gray" : "#1a1a1a" }}
                >
                  {timeDuration}
                </span>
              </div>
              <div className="decor-metric-icon decor-icon-gray-bg">
                <img src="/figma-assets/icons/Clock Circle.svg" alt="Time" />
              </div>
            </div>
          </div>
        )}
        {/* HV Wallets */}
        {hv_wallets_count !== undefined && (
          <div className="decor-metric-card">
            <div className="decor-metric-content">
              <div className="decor-metric-info">
                <span className="decor-metric-label">HV Wallets</span>
                <span
                  id="hv_wallets_count"
                  className="decor-metric-value"
                  style={{ color: isGray ? "gray" : "#1a1a1a" }}
                >
                  {Number(hv_wallets_count).toFixed(0)}
                </span>
              </div>
              <div className="decor-metric-icon decor-icon-blue-bg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
              </div>
            </div>
          </div>
        )}
        {/* HV Holdings */}
        {hv_holdings !== undefined && (
          <div className="decor-metric-card">
            <div className="decor-metric-content">
              <div className="decor-metric-info">
                <span className="decor-metric-label">HV Holdings</span>
                <span
                  id="hv_holdings"
                  className="decor-metric-value"
                  style={{ color: isGray ? "gray" : "#1a1a1a" }}
                >
                  {formatHvHoldings(hv_holdings)}
                </span>
              </div>
              <div className="decor-metric-icon decor-icon-green-bg">
                <img
                  src="/figma-assets/icons/Chart Square.svg"
                  alt="Holdings"
                />
              </div>
            </div>
          </div>
        )}
        {/* HV Avg Profit */}
        {hv_avg_profit_only !== undefined && (
          <div className="decor-metric-card">
            <div className="decor-metric-content">
              <div className="decor-metric-info">
                <span className="decor-metric-label">HV Avg Profit</span>
                <span
                  id="hv_avg_profit_only"
                  className="decor-metric-value"
                  style={{ color: isGray ? "gray" : "#10b981" }}
                >
                  {formatHvAvgProfit(hv_avg_profit_only)}
                </span>
              </div>
              <div className="decor-metric-icon decor-icon-mint-bg">
                <img src="/figma-assets/icons/Round Graph.svg" alt="Profit" />
              </div>
            </div>
          </div>
        )}
        {/* Bundle Ratio */}
        {bundle_ratio > 0.1 && (
          <div className="decor-metric-card">
            <div className="decor-metric-content">
              <div className="decor-metric-info">
                <span className="decor-metric-label">Bundle</span>
                <span
                  id="bundle_ratio"
                  className="decor-metric-value"
                  style={{ color: isGray ? "gray" : "#1a1a1a" }}
                >
                  {Math.round(bundle_ratio * 100)}%
                </span>
              </div>
              <div className="decor-metric-icon decor-icon-gray-bg">
                <img src="/figma-assets/icons/Copy.svg" alt="Bundle" />
              </div>
            </div>
          </div>
        )}
        <div className="decor-metric-card" id="icon-placeholder">
          <div className="decor-metric-content">
            <div className="decor-metric-info">
              <span className="decor-metric-label">Indicators</span>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                {dex_paid && <DexPaidIcon />}
                {valid_launch === false && <ValidLaunchIcon size="normal" />}
                {pump_dump_risk === true && <PumpDumpIcon size="normal" />}
                {!valid_socials && <ValidSocialsIcon size="normal" />}
                {!unique_socials && <UniqueSocialsIcon size="normal" />}
                <WalletIcon
                  fresh_creator_wallet={fresh_creator_wallet}
                  creator={creator}
                  size="normal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {}
      {/* Badges and Status Indicators */}
      <div className="mt-4 pt-3" style={{ borderTop: "1px solid #dee2e6" }}>
        <div
          id="indicator_icons"
          className="d-flex flex-wrap gap-2 align-items-center"
        >
          {bundle_ratio > 0.01 && (
            <span
              className="badge text-bg-warning"
              style={{
                filter: isGray ? "grayscale(100%)" : "none",
                fontSize: "12px",
                padding: "6px 12px",
              }}
            >
              Bundle: {Math.round(bundle_ratio * 100)}%
            </span>
          )}
          {total_comments > 0 && (
            <span
              className="badge text-bg-light align-middle"
              style={{
                fontSize: "12px",
                padding: "6px 12px",
              }}
            >
              <img
                src="/pflogo.png"
                alt="pump.fun"
                style={{
                  height: "12px",
                  width: "auto",
                  marginRight: "4px",
                  filter: isGray ? "grayscale(100%)" : "none",
                }}
              />
              {total_comments} Comments
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecorHeader;
