import React, { useRef, useEffect, useState } from "react";
import { createChart } from "lightweight-charts";
import ChartHeader from "./ChartHeader";
import ChartLegend from "./ChartLegend";

function Chart({
  chartId,
  name,
  symbol,
  candles,
  image,
  onRemove,
  hideHeader,
  probaPrice,
}) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const unrealizedProfitSeriesRef = useRef(null);
  const unrealizedLossSeriesRef = useRef(null);
  const realizedLossSeriesRef = useRef(null);
  const realizedProfitSeriesRef = useRef(null);
  const actorRankSeriesRef = useRef(null);

  // Define default indicator visibility.
  const defaultIndicatorVisibility = {
    unrealizedProfit: true,
    unrealizedLoss: true,
    realizedLoss: true,
    realizedProfit: true,
    actorRank: true,
  };

  // Load saved indicator visibility from localStorage, or fallback to defaults.
  const [indicatorVisibility, setIndicatorVisibility] = useState(() => {
    const stored = localStorage.getItem("indicatorVisibility");
    return stored ? JSON.parse(stored) : defaultIndicatorVisibility;
  });

  // Save indicator visibility to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem(
      "indicatorVisibility",
      JSON.stringify(indicatorVisibility)
    );
  }, [indicatorVisibility]);

  // Create the chart and add basic series on mount.
  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#000",
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      rightPriceScale: {
        visible: true,
      },
      leftPriceScale: {
        visible: true,
      },
    });

    // Add candlestick series.
    candleSeriesRef.current = chartRef.current.addCandlestickSeries();

    // Add volume histogram series (using solVal as volume).
    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: "#26a69a",
      priceFormat: { type: "volume" },
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // Set up a resize listener.
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const newWidth = chartContainerRef.current.clientWidth;
        chartRef.current.resize(newWidth, 300);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current.remove();
    };
  }, []);

  // Helper function to calculate color based on new_money_ratio
  const getColorFromRatio = (ratio) => {
    if (ratio === undefined || ratio === null) {
      // Default colors when new_money_ratio is missing
      return {
        upColor: "#5e91ff",
        downColor: "#335db6",
        borderUpColor: "#5e91ff",
        borderDownColor: "#335db6",
        wickUpColor: "#5e91ff",
        wickDownColor: "#335db6",
      };
    }

    // Clamp ratio between 0 and 1
    const clampedRatio = Math.max(0, Math.min(1, ratio));

    let bodyColor;
    let borderColor;

    if (clampedRatio < 0.1) {
      // Use default colors when ratio is below 0.1
      bodyColor = {
        upColor: "#5e91ff",
        downColor: "#335db6",
      };
      borderColor = {
        borderUpColor: "#5e91ff",
        borderDownColor: "#335db6",
      };
    } else {
      // Determine color based on ratio thresholds
      let color;
      if (clampedRatio >= 0.75) {
        color = "#ffff00"; // Yellow for ratio >= 0.75
      } else if (clampedRatio >= 0.49) {
        color = "#99ff00"; // Light green for ratio >= 0.49
      } else {
        color = "#ffcc00"; // Orange for ratio >= 0.1
      }

      bodyColor = {
        upColor: color,
        downColor: color,
      };

      // Yellow borders for positive ratios
      borderColor = {
        borderUpColor: "#ffff00",
        borderDownColor: "#ffff00",
      };
    }

    return {
      ...bodyColor,
      ...borderColor,
      wickUpColor: bodyColor.upColor,
      wickDownColor: bodyColor.downColor,
    };
  };

  // Update basic series data (candlestick & volume) when candles change.
  useEffect(() => {
    if (candles && candleSeriesRef.current) {
      const formattedCandles = candles.map((candle) => {
        const colors = getColorFromRatio(candle.new_money / candle.solVal);
        return {
          time: candle.time,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          color: colors.upColor, // Use the calculated color
        };
      });
      candleSeriesRef.current.setData(formattedCandles);

      const formattedVolume = candles.map((candle) => ({
        time: candle.time,
        value: candle.solVal,
        color: candle.close >= candle.open ? "#26a69a" : "#ef5350",
      }));
      volumeSeriesRef.current.setData(formattedVolume);
    }
  }, [candles]);

  // For each indicator series, add/remove based on indicatorVisibility.
  // Unrealized Profit
  useEffect(() => {
    if (indicatorVisibility.unrealizedProfit) {
      if (!unrealizedProfitSeriesRef.current) {
        unrealizedProfitSeriesRef.current = chartRef.current.addLineSeries({
          color: "#0f4a6e",
          lineWidth: 2,
          lineStyle: 0,
        });
      }
      const data = candles.map((candle) => ({
        time: candle.time,
        value: candle.unrealized_profit,
      }));
      unrealizedProfitSeriesRef.current.setData(data);
    } else if (unrealizedProfitSeriesRef.current) {
      chartRef.current.removeSeries(unrealizedProfitSeriesRef.current);
      unrealizedProfitSeriesRef.current = null;
    }
  }, [indicatorVisibility.unrealizedProfit, candles]);

  // Unrealized Loss
  useEffect(() => {
    if (indicatorVisibility.unrealizedLoss) {
      if (!unrealizedLossSeriesRef.current) {
        unrealizedLossSeriesRef.current = chartRef.current.addLineSeries({
          color: "#6e3d0f",
          lineWidth: 2,
          lineStyle: 0,
        });
      }
      const data = candles.map((candle) => ({
        time: candle.time,
        value: candle.unrealized_loss,
      }));
      unrealizedLossSeriesRef.current.setData(data);
    } else if (unrealizedLossSeriesRef.current) {
      chartRef.current.removeSeries(unrealizedLossSeriesRef.current);
      unrealizedLossSeriesRef.current = null;
    }
  }, [indicatorVisibility.unrealizedLoss, candles]);

  // Realized Loss
  useEffect(() => {
    if (indicatorVisibility.realizedLoss) {
      if (!realizedLossSeriesRef.current) {
        realizedLossSeriesRef.current = chartRef.current.addLineSeries({
          color: "#9d4e15",
          lineWidth: 2,
          lineStyle: 2,
        });
      }
      const data = candles.map((candle) => ({
        time: candle.time,
        value: candle.realized_loss,
      }));
      realizedLossSeriesRef.current.setData(data);
    } else if (realizedLossSeriesRef.current) {
      chartRef.current.removeSeries(realizedLossSeriesRef.current);
      realizedLossSeriesRef.current = null;
    }
  }, [indicatorVisibility.realizedLoss, candles]);

  // Realized Profit
  useEffect(() => {
    if (indicatorVisibility.realizedProfit) {
      if (!realizedProfitSeriesRef.current) {
        realizedProfitSeriesRef.current = chartRef.current.addLineSeries({
          color: "#156a9d",
          lineWidth: 2,
          lineStyle: 2,
        });
      }
      const data = candles.map((candle) => ({
        time: candle.time,
        value: candle.realized_profit,
      }));
      realizedProfitSeriesRef.current.setData(data);
    } else if (realizedProfitSeriesRef.current) {
      chartRef.current.removeSeries(realizedProfitSeriesRef.current);
      realizedProfitSeriesRef.current = null;
    }
  }, [indicatorVisibility.realizedProfit, candles]);

  // Actor Rank
  useEffect(() => {
    if (indicatorVisibility.actorRank) {
      if (!actorRankSeriesRef.current) {
        actorRankSeriesRef.current = chartRef.current.addLineSeries({
          priceScaleId: "actor_rank",
          color: "#c91483",
          lineWidth: 2,
          lineStyle: 0,
        });
        chartRef.current.priceScale("actor_rank").applyOptions({
          visible: true,
          scaleMargins: { top: 0.2, bottom: 0.2 },
        });
      }
      const data = candles.map((candle) => ({
        time: candle.time,
        value: candle.actor_rank,
      }));
      actorRankSeriesRef.current.setData(data);
    } else if (actorRankSeriesRef.current) {
      chartRef.current.removeSeries(actorRankSeriesRef.current);
      actorRankSeriesRef.current = null;
    }
  }, [indicatorVisibility.actorRank, candles]);

  // Create horizontal price line for probaPrice if provided and nonzero.
  useEffect(() => {
    let priceLine = null;
    if (probaPrice && probaPrice !== 0 && candleSeriesRef.current) {
      priceLine = candleSeriesRef.current.createPriceLine({
        price: probaPrice,
        color: "#ff0000",
        lineWidth: 2,
        lineStyle: 0,
        axisLabelVisible: true,
      });
    }
    return () => {
      if (priceLine && candleSeriesRef.current) {
        candleSeriesRef.current.removePriceLine(priceLine);
      }
    };
  }, [probaPrice]);

  // Compute the most recent cSolVal.
  const recentCSolVal =
    candles && candles.length > 0
      ? Number(candles[candles.length - 1].cSolVal).toFixed(2)
      : "";

  // Copy full Chart ID and Delete Chart handlers.
  const handleCopy = () => {
    navigator.clipboard
      .writeText(chartId)
      .then(() => console.log("Chart ID copied to clipboard"))
      .catch((err) => console.error("Failed to copy chart ID:", err));
  };

  const handleDelete = () => {
    fetch(`https://api.onchainrank.com/delete/${chartId}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          onRemove(chartId);
        } else {
          console.error("Failed to delete chart");
        }
      })
      .catch((err) => console.error("Error deleting chart:", err));
  };

  return (
    <div className="card">
      {!hideHeader && (
        <ChartHeader
          chartId={chartId}
          name={name}
          symbol={symbol}
          image={image}
          recentCSolVal={recentCSolVal}
          handleCopy={handleCopy}
          handleDelete={handleDelete}
        />
      )}
      <div className="card-body">
        <div ref={chartContainerRef} />
        <ChartLegend />
        {/* Checkbox controls for each indicator */}
        <div className="mt-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="unrealizedProfitCheckbox"
              checked={indicatorVisibility.unrealizedProfit}
              onChange={() =>
                setIndicatorVisibility({
                  ...indicatorVisibility,
                  unrealizedProfit: !indicatorVisibility.unrealizedProfit,
                })
              }
            />
            <label
              className="form-check-label"
              htmlFor="unrealizedProfitCheckbox"
            >
              Unrealized Profit
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="unrealizedLossCheckbox"
              checked={indicatorVisibility.unrealizedLoss}
              onChange={() =>
                setIndicatorVisibility({
                  ...indicatorVisibility,
                  unrealizedLoss: !indicatorVisibility.unrealizedLoss,
                })
              }
            />
            <label
              className="form-check-label"
              htmlFor="unrealizedLossCheckbox"
            >
              Unrealized Loss
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="realizedLossCheckbox"
              checked={indicatorVisibility.realizedLoss}
              onChange={() =>
                setIndicatorVisibility({
                  ...indicatorVisibility,
                  realizedLoss: !indicatorVisibility.realizedLoss,
                })
              }
            />
            <label className="form-check-label" htmlFor="realizedLossCheckbox">
              Realized Loss
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="realizedProfitCheckbox"
              checked={indicatorVisibility.realizedProfit}
              onChange={() =>
                setIndicatorVisibility({
                  ...indicatorVisibility,
                  realizedProfit: !indicatorVisibility.realizedProfit,
                })
              }
            />
            <label
              className="form-check-label"
              htmlFor="realizedProfitCheckbox"
            >
              Realized Profit
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="actorRankCheckbox"
              checked={indicatorVisibility.actorRank}
              onChange={() =>
                setIndicatorVisibility({
                  ...indicatorVisibility,
                  actorRank: !indicatorVisibility.actorRank,
                })
              }
            />
            <label className="form-check-label" htmlFor="actorRankCheckbox">
              Onchain Score
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chart;
