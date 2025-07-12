import React from "react";
import ValidLaunchIcon from "./components/ValidLaunchIcon";
import ValidSocialsIcon from "./components/ValidSocialsIcon";
import UniqueSocialsIcon from "./components/UniqueSocialsIcon";
import PumpDumpIcon from "./components/PumpDumpIcon";
import AdminComponent from "./AdminComponent";
import InfoIcon from "./components/InfoIcon";
import WalletIcon from "./components/WalletIcon";

const SingleHeader = ({
  recentCSolVal,
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
}) => {
  const fmt = (ts) => new Date(ts * 1000).toLocaleString();

  // Volume color
  const volume = Number(recentCSolVal);
  let volumeColor = "green";
  if (volume < 200) volumeColor = "red";
  else if (volume < 400) volumeColor = "orange";

  // AR styling
  const ar = Math.round(Number(recentActorRank));
  let arColor = ar > 400 ? "green" : ar < 200 ? "red" : "orange";
  const arStyle = ar > 520 ? { fontWeight: "bold" } : {};

  const handleSearchX = () => {
    if (id) {
      const searchUrl = `https://x.com/search?q=${encodeURIComponent(
        id
      )}&src=typed_query&f=live`;
      window.open(searchUrl, "_blank");
    }
  };

  return (
    <div
      className="card-header d-flex align-items-center flex-wrap"
      style={{ fontSize: "12px" }}
    >
      <img
        src="/logo.png"
        alt="Logo"
        style={{ height: "17px", width: "auto", marginRight: "10px" }}
      />

      <span style={{ color: volumeColor, marginRight: 8 }}>
        <span style={{ color: "gray" }}>VOL:</span> {recentCSolVal}
      </span>

      <div className="d-flex align-items-center" style={{ marginRight: 8 }}>
        <span style={{ marginRight: 4 }}>
          <span style={{ color: "gray" }}>OS:</span>
          <span style={{ color: arColor, marginRight: 1, marginLeft: 2 }}>
            {ar}{" "}
          </span>{" "}
          ({Math.round(max_cactor_rank)})
        </span>
        <InfoIcon text="Token Onchain Score: Current (Max)" />
      </div>

      {bullx !== undefined && (
        <span style={{ marginRight: 8 }}>BullX: {bullx}</span>
      )}

      {hv_wallets_count !== undefined && (
        <span style={{ marginRight: 8 }}>
          <span style={{ color: "gray" }}>HV Wallets:</span>{" "}
          {Number(hv_wallets_count).toFixed(0)}
        </span>
      )}

      {hv_holdings !== undefined && (
        <span style={{ marginRight: 8 }}>
          <span style={{ color: "gray" }}>HV Holdings:</span>{" "}
          {Number(hv_holdings).toFixed(2)}
        </span>
      )}

      {hv_avg_profit_only !== undefined && (
        <span style={{ marginRight: 8 }}>
          <span style={{ color: "gray" }}>HV Avg Profit:</span>{" "}
          {Number(hv_avg_profit_only).toFixed(2)}
        </span>
      )}

      {role === "admin" && <AdminComponent id={id} token={token} />}

      {id && (
        <button
          onClick={handleSearchX}
          className="btn btn-sm"
          style={{
            marginRight: 8,
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

      {dex_paid && (
        <span className="badge bg-success" style={{ marginRight: 8 }}>
          dex paid
        </span>
      )}

      {valid_launch === false && <ValidLaunchIcon />}
      {pump_dump_risk === true && <PumpDumpIcon />}

      {!valid_socials && <ValidSocialsIcon />}
      {!unique_socials && <UniqueSocialsIcon />}

      <WalletIcon fresh_creator_wallet={fresh_creator_wallet} creator={creator} />

      {bundle_ratio > 0.01 && (
        <span className="badge text-bg-warning" style={{ marginRight: 8 }}>
          Bundle:{Math.round(bundle_ratio * 100)}%
        </span>
      )}
      {total_comments > 0 && (
        <span className="badge text-bg-light align-middle">
          <img
            src="/pflogo.png"
            alt="pump.fun Logo"
            style={{ height: "12px", width: "auto", marginRight: "0px" }}
          />
          {total_comments}
        </span>
      )}
    </div>
  );
};

export default SingleHeader;
