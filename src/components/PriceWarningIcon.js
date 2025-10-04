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
      className="bi bi-cash ms-1"
      viewBox="0 0 16 16"
      style={{ marginLeft: "4px" }}
      title="High Price warning indicator"
    >
      <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
      <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
    </svg>
  );
};

export default PriceWarningIcon;
