// components/OnchainScore.tsx
import React from "react";

interface OnchainScoreProps {
  onchainScore: number;
  maxOnchainScore: number;
}

export default function OnchainScore({
  onchainScore,
  maxOnchainScore,
}: OnchainScoreProps) {
  /**
   * Example color logic:
   * - Green if value ≥ 75% of cap
   * - Yellow if value is between 50% and 75% of cap
   * - Red if value < 50% of cap
   *
   * Adjust thresholds or color codes as needed.
   */
  const getColor = (value: number, cap: number) => {
    const pct = cap > 0 ? value / cap : 0;
    if (pct >= 0.75) return "#16a34a"; // green-600
    if (pct >= 0.5) return "#ca8a04";  // yellow-600
    return "#dc2626";                  // red-600
  };

  // onchainScore colored relative to maxOnchainScore
  const onchainColor = getColor(onchainScore, maxOnchainScore);
  // maxOnchainScore colored relative to itself (always green using this logic)
  const maxColor = getColor(maxOnchainScore, maxOnchainScore);

  return (
    <div className="flex items-baseline space-x-1">
      {/* Label */}
      <span className="font-medium text-gray-700">Onchain Score:</span>

      {/* Current score with its own color */}
      <span
        className="font-semibold"
        style={{ color: onchainColor }}
      >
        {onchainScore}
      </span>

      {/* Max score in parentheses with its own color */}
      <span
        className="font-semibold"
        style={{ color: maxColor }}
      >
        ({maxOnchainScore})
      </span>
    </div>
  );
}
