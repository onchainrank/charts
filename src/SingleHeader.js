import React from "react";

const SingleHeader = ({
  recentCSolVal,
  max_cactor_rank,
  volRatio,
  recentActorRank,
  dex_paid,
  valid_socials,
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
      <span style={{ color: mcarColor }}>MAR: {max_cactor_rank}</span> |{" "}
      <span style={{ color: actorRankColor, ...actorRankStyle }}>
        AR: {actorRank}
      </span>{" "}
      | <span style={{ color: vrColor }}>VR: {volRatio}</span>
      {dex_paid && <span className="badge bg-success ms-2">dex paid</span>}
      {!valid_socials === false && (
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
    </div>
  );
};

export default SingleHeader;
