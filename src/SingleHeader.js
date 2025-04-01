import React from "react";

const SingleHeader = ({
  recentCSolVal,
  max_cactor_rank,
  volRatio,
  recentActorRank,
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
        style={{ height: "16px", width: "auto", marginRight: "10px" }}
      />
      <span style={{ color: volumeColor }}>Volume: {recentCSolVal}</span> |{" "}
      <span style={{ color: mcarColor }}>MCAR: {max_cactor_rank}</span> |{" "}
      <span style={{ color: actorRankColor, ...actorRankStyle }}>
        AR: {actorRank}
      </span>{" "}
      | <span style={{ color: vrColor }}>VR: {volRatio}</span>
    </div>
  );
};

export default SingleHeader;
