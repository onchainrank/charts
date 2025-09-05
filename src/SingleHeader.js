import React from "react";
import ValidLaunchIcon from "./components/ValidLaunchIcon";
import ValidSocialsIcon from "./components/ValidSocialsIcon";
import UniqueSocialsIcon from "./components/UniqueSocialsIcon";
import PumpDumpIcon from "./components/PumpDumpIcon";
import AdminComponent from "./AdminComponent";
import InfoIcon from "./components/InfoIcon";
import WalletIcon from "./components/WalletIcon";
import PriceWarningIcon from "./components/PriceWarningIcon";

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

  const handleSearchX = () => {
    if (id) {
      const searchUrl = `https://x.com/search?q=${encodeURIComponent(
        id
      )}&src=typed_query&f=live`;
      window.open(searchUrl, "_blank");
    }
  };

  return (
    <div className="card-header" style={{ fontSize: "12px" }}>
      {/* Header with Logo and Actions */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <img
          src="/logo.png"
          alt="Logo"
          style={{ height: "17px", width: "auto" }}
        />
        <div className="d-flex align-items-center gap-2">
          {id && (
            <button
              onClick={handleSearchX}
              className="btn btn-sm"
              style={{
                padding: "2px 6px",
                border: "1px solid #ccc",
                borderRadius: "4px",
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

      {/* 3-Column Data Layout */}
      <div className="row">
        {/* Column 1: Trading Metrics */}
        <div className="col-md-4">
          <div className="mb-1">
            <strong>Trading Metrics</strong>
          </div>
          <div className="mb-1">
            <span style={{ color: "gray" }}>VOL:</span>{" "}
            <span style={{ color: volumeColor, fontWeight: "bold" }}>
              {recentCSolVal}
            </span>
          </div>
          <div className="mb-1">
            <span style={{ color: "gray" }}>Total Fee:</span>{" "}
            <span style={{ fontWeight: "bold" }}>{recentTotalFee}</span>
          </div>
          {recentHt && (
            <div className="mb-1">
              <span style={{ color: "gray" }}>HT:</span>{" "}
              <span style={{ fontWeight: "bold", color: htColor }}>{recentHt}</span>
              <PriceWarningIcon closePrice={recentClose} />
            </div>
          )}
          {bullx !== undefined && (
            <div className="mb-1">
              <span style={{ color: "gray" }}>BullX:</span>{" "}
              <span style={{ fontWeight: "bold" }}>{bullx}</span>
            </div>
          )}
        </div>

        {/* Column 2: Wallet Analytics */}
        <div className="col-md-4">
          <div className="mb-1">
            <strong>Wallet Analytics</strong>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span style={{ color: "gray" }}>OS:</span>
            <span style={{ color: arColor, fontWeight: "bold", marginLeft: 4 }}>
              {ar}
            </span>
            <span style={{ color: "gray", marginLeft: 2 }}>
              ({Math.round(max_cactor_rank)})
            </span>
            <InfoIcon text="Token Onchain Score: Current (Max)" />
          </div>
          {hv_wallets_count !== undefined && (
            <div className="mb-1">
              <span style={{ color: "gray" }}>HV Wallets:</span>{" "}
              <span style={{ fontWeight: "bold" }}>
                {Number(hv_wallets_count).toFixed(0)}
              </span>
            </div>
          )}
          {hv_holdings !== undefined && (
            <div className="mb-1">
              <span style={{ color: "gray" }}>HV Holdings:</span>{" "}
              <span style={{ fontWeight: "bold" }}>
                {Number(hv_holdings).toFixed(2)}
              </span>
            </div>
          )}
          {hv_avg_profit_only !== undefined && (
            <div className="mb-1">
              <span style={{ color: "gray" }}>HV Avg Profit:</span>{" "}
              <span style={{ fontWeight: "bold" }}>
                {Number(hv_avg_profit_only).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Column 3: Status & Indicators */}
        <div className="col-md-4">
          <div className="mb-1">
            <strong>Status & Indicators</strong>
          </div>
          <div className="d-flex flex-wrap gap-1 align-items-center">
            {dex_paid && (
              <span className="badge bg-success">dex paid</span>
            )}
            {bundle_ratio > 0.01 && (
              <span className="badge text-bg-warning">
                Bundle:{Math.round(bundle_ratio * 100)}%
              </span>
            )}
            {total_comments > 0 && (
              <span className="badge text-bg-light align-middle">
                <img
                  src="/pflogo.png"
                  alt="pump.fun Logo"
                  style={{ height: "12px", width: "auto", marginRight: "2px" }}
                />
                {total_comments}
              </span>
            )}
          </div>
          <div className="d-flex flex-wrap gap-1 align-items-center mt-2">
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
      </div>
    </div>
  );
};

export default SingleHeader;
