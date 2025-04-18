import React from "react";

const SingleHeader = ({
  recentCSolVal,
  max_cactor_rank,
  volRatio,
  recentActorRank,
  dex_paid,
  valid_socials,
  unique_socials,
}) => {
  // Determine volume color based on recentCSolVal (Volume)
  const volume = Number(recentCSolVal);
  let volumeColor = "green";
  if (volume < 200) {
    volumeColor = "red";
  } else if (volume < 400) {
    volumeColor = "orange";
  }

  // Determine VR color based on volRatio
  const volRatioNum = Number(volRatio);
  let vrColor = "green";
  if (volRatioNum < 0) {
    vrColor = "red";
  } else if (volRatioNum < 0.2) {
    vrColor = "orange";
  } else {
    vrColor = "green";
  }

  // Determine MCAR color based on max_cactor_rank
  const mcar = Number(max_cactor_rank);
  let mcarColor = "orange";
  if (mcar > 120) {
    mcarColor = "green";
  } else if (mcar < 70) {
    mcarColor = "red";
  }

  // Round actor rank to an integer and determine its color and style.
  const actorRank = Math.round(Number(recentActorRank));
  let actorRankColor = "green";
  let actorRankStyle = {};
  if (actorRank < 60) {
    actorRankColor = "red";
  } else if (actorRank < 80) {
    actorRankColor = "orange";
  } else if (actorRank > 120) {
    actorRankColor = "green";
    actorRankStyle.fontWeight = "bold";
  }

  return (
    <div className="card-header d-flex align-items-center">
      {/* Display logo from public folder */}
      <img
        src="/logo.png"
        alt="Logo"
        style={{ height: "24px", width: "auto", marginRight: "10px" }}
      />
      <span style={{ color: volumeColor }}>Volume: {recentCSolVal}</span> |{" "}
      <span style={{ color: mcarColor }}>MCAR: {max_cactor_rank}</span> |{" "}
      <span style={{ color: actorRankColor, ...actorRankStyle }}>
        AR: {actorRank}
      </span>{" "}
      | <span style={{ color: vrColor }}>VR: {volRatio}</span>
      {dex_paid && <span className="badge bg-success ms-2">dex paid</span>}
      {/* Display social icon (Facebook) only if valid_socials is false */}
      {!valid_socials && (
        <span
          className="ms-2"
          title="Social accounts incorrectly added or misleading: invalid links or duplicate pages detected (e.g., Twitter and website link to the same page)."
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="red"
            className="bi bi-facebook"
            viewBox="0 0 16 16"
          >
            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
          </svg>
        </span>
      )}
      {/* Display Twitter icon if unique_socials is true */}
      {!unique_socials && (
        <span
          className="ms-2"
          title="Social account already used in previous projects"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="red"
            className="bi bi-twitter"
            viewBox="0 0 16 16"
          >
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default SingleHeader;
