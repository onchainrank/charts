import React from "react";

const SingleHeader = ({
  recentCSolVal,
  max_cactor_rank,
  volRatio,
  recentActorRank,
  dex_paid,
  valid_socials,
  valid_launch,
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
      {/* Display social icon if valid_socials is false */}
      {!valid_socials && (
        <span className="ms-2">
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
      {/* Display rocket icon if valid_launch is false */}
      {!valid_launch && (
        <span className="ms-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="red"
            className="bi bi-rocket-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.175 1.991c.81 1.312 1.583 3.43 1.778 6.819l1.5 1.83A2.5 2.5 0 0 1 14 12.202V15.5a.5.5 0 0 1-.9.3l-1.125-1.5c-.166-.222-.42-.4-.752-.57-.214-.108-.414-.192-.627-.282l-.196-.083C9.7 13.793 8.85 14 8 14s-1.7-.207-2.4-.635q-.101.044-.198.084c-.211.089-.411.173-.625.281-.332.17-.586.348-.752.57L2.9 15.8a.5.5 0 0 1-.9-.3v-3.298a2.5 2.5 0 0 1 .548-1.562l.004-.005L4.049 8.81c.197-3.323.969-5.434 1.774-6.756.466-.767.94-1.262 1.31-1.57a3.7 3.7 0 0 1 .601-.41A.55.55 0 0 1 8 0c.101 0 .17.027.25.064q.056.025.145.075c.118.066.277.167.463.315.373.297.85.779 1.317 1.537M9.5 6c0-1.105-.672-2-1.5-2s-1.5.895-1.5 2S7.172 8 8 8s1.5-.895 1.5-2" />
            <path d="M8 14.5c.5 0 .999-.046 1.479-.139L8.4 15.8a.5.5 0 0 1-.8 0l-1.079-1.439c.48.093.98.139 1.479.139" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default SingleHeader;
