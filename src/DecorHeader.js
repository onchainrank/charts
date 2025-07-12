import React from "react";
import InfoIcon from "./components/InfoIcon";
import WalletIcon from "./components/WalletIcon";

const DecorHeader = ({
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
  migrated,
  name,
  symbol,
  image,
  id, // <-- make sure 'id' is passed in as a prop
  fresh_creator_wallet,
  creator,
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

  // Compute colors/styles, but override to gray if isGray
  const volumeColor = getColor(volumeNum, { low: 200, high: 400 });
  const mcarColor = getColor(mcarNum, { low: 200, high: 400 });
  const arColor = getColor(actorRankNum, { low: 200, high: 400 });

  // Actor‐rank gets bold only if not migrated and >520
  const arStyle = isGray
    ? {}
    : actorRankNum > 520
    ? { fontWeight: "bold" }
    : {};

  const XMark = () => (
    <span
      style={{
        color: isGray ? "gray" : "red",
        marginRight: "0.25rem",
      }}
    >
      ✖
    </span>
  );

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
    <div className="row">
      {/* LEFT COLUMN: list all <p> elements vertically */}
      <div className="col-md-6">
        {/* Show "token migrated" only when migrated is true */}
        {isGray && (
          <span className="badge bg-warning text-dark mb-2">
            token migrated
          </span>
        )}

        <p style={pStyle}>
          Total Volume: <span style={{ color: volumeColor }}>{volumeNum}</span>
        </p>

        <p style={pStyle}>
          Onchain Score:{" "}
          <span style={{ color: arColor, ...arStyle }}>{actorRankNum}</span> (
          <span style={{ color: mcarColor }}>{Math.round(mcarNum)}</span>)
        </p>

        {bullx !== undefined && <p style={pStyle}>BullX: {bullx}</p>}

        <div className="d-flex align-items-center">
          <WalletIcon fresh_creator_wallet={fresh_creator_wallet} creator={creator} />
        </div>

        {dex_paid && (
          <span className="badge bg-success ms-2" style={{ marginRight: 8 }}>
            dex paid
          </span>
        )}

        {!valid_launch && (
          <p style={pStyle}>
            <XMark />
            Detected invalid launch{" "}
            <InfoIcon text="Invalid launch detected: on-chain data exhibit patterns commonly associated with scams." />
          </p>
        )}

        {pump_dump_risk && (
          <p style={pStyle}>
            <XMark />
            Detected high pump‐dump risk
            <InfoIcon text="Detected volume patterns commonly associated with pump-dump scams." />
          </p>
        )}

        {!valid_socials && (
          <p style={pStyle}>
            <XMark />
            Metadata misconfigured
            <InfoIcon text="This warning is shown when a social media account (e.g., Twitter/X or Telegram) is entered in the Website field. The Website field should contain a valid URL, and social media handles belong in their designated fields." />
          </p>
        )}

        {!unique_socials && (
          <p style={pStyle}>
            <XMark />
            Duplicate socials
          </p>
        )}

        {bundle_ratio > 0.01 && (
          <p style={pStyle}>Bundle: {Math.round(bundle_ratio * 100)}%</p>
        )}

        {total_comments > 0 && (
          <p className="d-flex align-items-center" style={pStyle}>
            # Comments on{" "}
            <img
              src="/pflogo.png"
              alt="pump.fun Logo"
              style={{
                height: "12px",
                width: "auto",
                marginRight: "2px",
                marginLeft: "2px",
                filter: isGray ? "grayscale(100%)" : "none",
              }}
            />
            : {total_comments}
          </p>
        )}
      </div>

      {/* RIGHT COLUMN: circular image with text to its right, or loading spinner */}
      <div className="col-md-6 d-flex align-items-center justify-content-center">
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
                    class="bi bi-copy"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
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
  );
};

export default DecorHeader;
