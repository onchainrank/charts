import React from "react";
import ValidLaunchIcon from "./components/ValidLaunchIcon";
import ValidSocialsIcon from "./components/ValidSocialsIcon";
import UniqueSocialsIcon from "./components/UniqueSocialsIcon";
import PumpDumpIcon from "./components/PumpDumpIcon";
import PumpFunIcon from "./components/PumpFunIcon";
import AdminComponent from "./AdminComponent";
import InfoIcon from "./components/InfoIcon";
import WalletIcon from "./components/WalletIcon";
import PriceWarningIcon from "./components/PriceWarningIcon";
import "./DashboardStyles.css";

const SingleHeader = ({
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
  role,
  id,
  token,
  hv_wallets_count,
  hv_holdings,
  hv_avg_profit_only,
  fresh_creator_wallet,
  creator,
  recentHt,
  recentClose,
  timeDuration,
  image,
}) => {
  // Volume color
  const volume = Number(recentCSolVal);
  let volumeColor = "green";
  if (volume < 200) volumeColor = "red";
  else if (volume < 400) volumeColor = "orange";

  // AR styling
  const ar = Math.round(Number(recentActorRank));
  let arColor = ar > 400 ? "green" : ar < 200 ? "red" : "orange";

  // HT styling
  const ht = Number(recentHt);
  let htColor = "black";
  if (ht > 0.4) htColor = "red";
  else if (ht < 0.25) htColor = "green";

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

  const handleSearchX = () => {
    if (id) {
      const searchUrl = `https://x.com/search?q=${encodeURIComponent(
        id
      )}&src=typed_query&f=live`;
      window.open(searchUrl, "_blank");
    }
  };

  return (
    <div className="dashboard-container">
      <header
        className="dashboard-header-top"
        style={{
          justifyContent: "flex-end",
          position: "relative",
          overflow: "visible",
          height: "30px",
        }}
      >
        <img
          id="token-image"
          src={image}
          alt="mint logo"
          className="logo"
          style={{
            width: "50px",
            height: "50px",
            position: "absolute",
            top: "0",
            right: "0",
            zIndex: 10,
            borderRadius: "50%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
            cursor: "pointer",
            transformOrigin: "top right",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />
      </header>

      {/* Main Dashboard Content */}
      <main className="dashboard-content">
        {/* Trading Metrics Column */}
        <div className="stats-column">
          <h2 className="column-title">Trading Metrics</h2>
          <div className="metrics-list">
            <div className="metric-item">
              <div className="icon-wrapper icon-bg-green">
                <img
                  src="/dashboard-icons/vol.svg"
                  alt="VOL icon"
                  className="metric-icon"
                />
              </div>
              <div className="metric-text">
                <span className="metric-label">VOL</span>
                <span className={`metric-value ${volumeColor}`}>
                  {recentCSolVal}
                </span>
              </div>
            </div>
            <div className="metric-item">
              <div className="icon-wrapper icon-bg-blue">
                <img
                  src="/dashboard-icons/total_fee.svg"
                  alt="Total Fee icon"
                  className="metric-icon"
                />
              </div>
              <div className="metric-text">
                <span className="metric-label">Total Fee</span>
                <span className="metric-value">{recentTotalFee}</span>
              </div>
            </div>
            {recentHt && (
              <div className="metric-item">
                <div className="icon-wrapper icon-bg-red">
                  <img
                    src="/dashboard-icons/ht.svg"
                    alt="HT icon"
                    className="metric-icon"
                  />
                </div>
                <div className="metric-text">
                  <span className="metric-label">HT</span>
                  <span
                    className={`metric-value ${
                      htColor === "red"
                        ? "red"
                        : htColor === "green"
                        ? "green"
                        : ""
                    }`}
                  >
                    {recentHt}
                    <PriceWarningIcon closePrice={recentClose} size="small" />
                  </span>
                </div>
              </div>
            )}
            <div className="metric-item">
              <div className="icon-wrapper icon-bg-yellow">
                <img
                  src="/dashboard-icons/fri.svg"
                  alt="FRI icon"
                  className="metric-icon"
                />
              </div>
              <div className="metric-text">
                <span className="metric-label">FRI</span>
                <span className="metric-value">
                  {recentTotalFee &&
                  recentCSolVal &&
                  Number(recentCSolVal) !== 0
                    ? (Number(recentTotalFee) / Number(recentCSolVal)).toFixed(
                        4
                      )
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Analytics Column */}
        <div className="stats-column">
          <h2 className="column-title">Wallet Analytics</h2>
          <div className="metrics-list">
            <div className="metric-item">
              <div className="icon-wrapper icon-bg-green-2">
                <img
                  src="/dashboard-icons/os.svg"
                  alt="OS icon"
                  className="metric-icon"
                />
              </div>
              <div className="metric-text">
                <span className="metric-label" id="recentActorRank">
                  OS <InfoIcon text="Token Onchain Score: Current (Max)" />
                </span>
                <span className={`metric-value ${arColor}`}>
                  {ar}{" "}
                  <span id="max_cactor_rank" class="gr">
                    ({Math.round(max_cactor_rank)})
                  </span>
                </span>
              </div>
            </div>
            {hv_wallets_count !== undefined && (
              <div className="metric-item">
                <div className="icon-wrapper icon-bg-cyan">
                  <img
                    src="/dashboard-icons/hv_wallets.svg"
                    alt="HV Wallets icon"
                    className="metric-icon"
                  />
                </div>
                <div className="metric-text">
                  <span className="metric-label">HV Wallets</span>
                  <span className="metric-value">
                    {Number(hv_wallets_count).toFixed(0)}{" "}
                    <span class="gr">({formatHvHoldings(hv_holdings)})</span>
                  </span>
                </div>
              </div>
            )}
            {hv_avg_profit_only !== undefined && (
              <div className="metric-item">
                <div className="icon-wrapper icon-bg-magenta">
                  <img
                    src="/dashboard-icons/hv_avg_profit.svg"
                    alt="HV Avg Profit icon"
                    className="metric-icon"
                  />
                </div>
                <div className="metric-text">
                  <span className="metric-label">HV Avg Profit</span>
                  <span className="metric-value">
                    {formatHvAvgProfit(hv_avg_profit_only)}
                  </span>
                </div>
              </div>
            )}
            <div>
              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {id && (
                    <button
                      onClick={handleSearchX}
                      className="btn btn-sm"
                      style={{
                        padding: "6px 12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Search on X.com"
                    >
                      <img
                        src="/searchonX.png"
                        alt="Search on X"
                        style={{ height: "16px", width: "16px" }}
                      />
                    </button>
                  )}
                  {role === "admin" && <AdminComponent id={id} token={token} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Indicators Column */}
        <div className="stats-column">
          <h2 className="column-title">Status & Indicators</h2>
          <div className="metrics-list">
            {timeDuration && (
              <div className="metric-item">
                <div className="icon-wrapper icon-bg-blue-2">
                  <img
                    src="/dashboard-icons/last_update.svg"
                    alt="Last Update icon"
                    className="metric-icon"
                  />
                </div>
                <div className="metric-text">
                  <span className="metric-label">Token Created</span>
                  <span className="metric-value">{timeDuration}</span>
                </div>
              </div>
            )}
            {bundle_ratio > 0.01 && (
              <div className="metric-item">
                <div className="icon-wrapper icon-bg-brown">
                  <img
                    src="/dashboard-icons/bundle.svg"
                    alt="Bundle icon"
                    className="metric-icon"
                  />
                </div>
                <div className="metric-text">
                  <span className="metric-label">Bundle</span>
                  <span className="metric-value orange">
                    {Math.round(bundle_ratio * 100)}%
                  </span>
                </div>
              </div>
            )}
            {/* <div className="metric-item">
              <div className="icon-wrapper icon-bg-green-2">
                <img
                  src="/dashboard-icons/status.svg"
                  alt="Status icon"
                  className="metric-icon"
                />
              </div>
              <div className="metric-text">
                <span className="metric-label">Status</span>
                <span className="metric-value">
                  {dex_paid ? "Active" : "Pending"}
                  {total_comments > 0 && (
                    <img
                      src="/pflogo.png"
                      alt="pump.fun"
                      style={{
                        height: "12px",
                        width: "auto",
                        marginLeft: "4px",
                      }}
                    />
                  )}
                </span>
              </div>
            </div> */}
            <div
              className="metric-item social-item"
              id="icons"
              style={{ width: "auto", flex: "0 0 auto", marginLeft: "auto" }}
            >
              <div className="social-icons">
                {(true || !valid_socials) && (
                  <div className="social-icon-wrapper social-bg-red">
                    <div className="social-icon-inner social-inner-red">
                      <ValidSocialsIcon size="small" />
                    </div>
                  </div>
                )}
                {(!unique_socials || true) && (
                  <div className="social-icon-group">
                    <div className="social-icon-wrapper social-bg-red">
                      <div className="social-icon-inner social-inner-red">
                        <UniqueSocialsIcon size="small" />
                      </div>
                    </div>
                  </div>
                )}

                {valid_launch === false && (
                  <div className="social-icon-wrapper social-bg-red">
                    <div className="social-icon-inner social-inner-red">
                      <ValidLaunchIcon size="small" />
                    </div>
                  </div>
                )}
                {pump_dump_risk === true && (
                  <div className="social-icon-wrapper social-bg-red">
                    <div className="social-icon-inner social-inner-red">
                      <PumpDumpIcon size="small" />
                    </div>
                  </div>
                )}
                <WalletIcon
                  fresh_creator_wallet={fresh_creator_wallet}
                  creator={creator}
                  size="small"
                />
                {(total_comments > 0 || true) && (
                  <PumpFunIcon count={22} size="small" />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleHeader;
