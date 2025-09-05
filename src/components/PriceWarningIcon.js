const PriceWarningIcon = ({ closePrice }) => {
  // Determine fill color based on price
  let fillColor;
  if (closePrice > 150) {
    fillColor = "red";
  } else if (closePrice > 100) {
    fillColor = "orange";
  } else {
    return null; // No icon for price <= 100
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill={fillColor}
      className="bi bi-caret-down-square-fill ms-1"
      viewBox="0 0 16 16"
      style={{ marginLeft: "4px" }}
    >
      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4 4a.5.5 0 0 0-.374.832l4 4.5a.5.5 0 0 0 .748 0l4-4.5A.5.5 0 0 0 12 6z" />
    </svg>
  );
};

export default PriceWarningIcon;
