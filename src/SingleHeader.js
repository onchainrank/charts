import React from "react";

const SingleHeader = ({ recentCSolVal }) => {
  return (
    <div className="card-header">
      <span>cSolVal: {recentCSolVal}</span>
    </div>
  );
};

export default SingleHeader;
