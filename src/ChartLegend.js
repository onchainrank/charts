import React from "react";

const ChartLegend = () => {
  // Legend items with updated colors and intended line styles.
  const legendItems = [
    { color: "#0f4a6e", label: "unrealized_profit" },
    { color: "#6e3d0f", label: "unrealized_loss" },
    { color: "#9d4e15", label: "realized_loss" },
    { color: "#156a9d", label: "realized_profit" },
    { color: "#c91483", label: "actor_rank" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        marginTop: "5px",
        flexWrap: "wrap",
      }}
    >
      {legendItems.map((item) => (
        <div
          key={item.label}
          style={{ display: "flex", alignItems: "center", margin: "2px" }}
        >
          <div
            style={{
              backgroundColor: item.color,
              width: "10px",
              height: "10px",
              marginRight: "5px",
            }}
          ></div>
          <small>{item.label}</small>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
