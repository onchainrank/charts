import React from "react";
import ValidLaunchIcon from "./components/ValidLaunchIcon";
import ValidSocialsIcon from "./components/ValidSocialsIcon";
import UniqueSocialsIcon from "./components/UniqueSocialsIcon";
import PumpDumpIcon from "./components/PumpDumpIcon";

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
}) => {
  const fmt = (ts) => new Date(ts * 1000).toLocaleString();

  // Volume color
  const volume = Number(recentCSolVal);
  let volumeColor = "green";
  if (volume < 200) volumeColor = "red";
  else if (volume < 400) volumeColor = "orange";

  // MCAR color
  const mcarN = Number(max_cactor_rank);
  let mcarColor = mcarN > 120 ? "green" : mcarN < 70 ? "red" : "orange";

  // AR styling
  const ar = Math.round(Number(recentActorRank));
  let arColor = ar < 60 ? "red" : ar < 80 ? "orange" : "green";
  const arStyle = ar > 120 ? { fontWeight: "bold" } : {};

  return (
    <div className="card-header d-flex align-items-center flex-wrap">
      <img
        src="/logo.png"
        alt="Logo"
        style={{ height: "24px", width: "auto", marginRight: "10px" }}
      />

      <span style={{ color: volumeColor, marginRight: 8 }}>
        Vol: {recentCSolVal}
      </span>
      <span style={{ color: mcarColor, marginRight: 8 }}>
        MCAR: {Math.round(max_cactor_rank)}
      </span>
      <span style={{ color: arColor, ...arStyle, marginRight: 8 }}>
        AR: {ar}
      </span>

      {bullx !== undefined && (
        <span style={{ marginRight: 8 }}>BullX: {bullx}</span>
      )}

      {dex_paid && (
        <span className="badge bg-success ms-2" style={{ marginRight: 8 }}>
          dex paid
        </span>
      )}

      {/* valid_launch logic */}
      {valid_launch === false && <ValidLaunchIcon />}
      {pump_dump_risk === true && <PumpDumpIcon />}

      {!valid_socials && <ValidSocialsIcon />}
      {!unique_socials && <UniqueSocialsIcon />}

      {bundle_ratio > 0.01 && (
        <span class="badge text-bg-alert">
          Bundle:{Math.round(bundle_ratio * 100)}%
        </span>
      )}
    </div>
  );
};

export default SingleHeader;
