const PriceWarningIcon = ({ closePrice, size = "normal" }) => {
  // normal size is 25% smaller than original (16px = 12px), small is 50% of normal
  const dimensions = size === "small" ? 8 : 12;

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
      width={dimensions}
      height={dimensions}
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
