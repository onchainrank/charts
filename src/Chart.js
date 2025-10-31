import React, { useRef, useEffect, useState } from "react";
import { createChart } from "lightweight-charts";
import ChartHeader from "./ChartHeader";
import "./DashboardStyles.css";

// Helper component to render line style indicator
const LineStyleIndicator = ({ color, lineStyle }) => {
  const getLinePattern = (style) => {
    switch (style) {
      case 0:
        return "none"; // Solid
      case 1:
        return "2,2"; // Dotted
      case 2:
        return "6,3"; // Dashed
      default:
        return "none";
    }
  };

  return (
    <svg
      width="40"
      height="12"
      style={{ marginLeft: "8px", verticalAlign: "middle" }}
    >
      <line
        x1="0"
        y1="6"
        x2="40"
        y2="6"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={getLinePattern(lineStyle)}
      />
    </svg>
  );
};

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
  const last10secVolSeriesRef = useRef(null);
  const last5secVolSeriesRef = useRef(null);
  const buyVolumeSeriesRef = useRef(null);
  const sellVolumeSeriesRef = useRef(null);
  const htSeriesRef = useRef(null);
  const totalVolumeSeriesRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // Define default indicator visibility.
  const defaultIndicatorVisibility = {
    unrealizedProfit: true,
    unrealizedLoss: true,
    realizedLoss: false,
    realizedProfit: false,
    actorRank: true,
    last10secVol: false,
    last5secVol: false,
    buyVolume: false,
    sellVolume: false,
    ht: true,
    totalVolume: false,
  };

  // Define default candle colors
  const defaultCandleColors = {
    // Default candles (low new money ratio)
    defaultUp: "#c0e7ffff",
    defaultDown: "#c0e7ffff",
    // New money candles (different ratio levels)
    newMoneyLow: "#535696ff", // ratio 0.1-0.49
    newMoneyMedium: "#393c8aff", // ratio 0.49-0.75
    newMoneyHigh: "#020438ff", // ratio >= 0.75
  };

  // Load saved indicator visibility from localStorage, or fallback to defaults.
  const [indicatorVisibility, setIndicatorVisibility] = useState(() => {
    const stored = localStorage.getItem("indicatorVisibility");
    return stored ? JSON.parse(stored) : defaultIndicatorVisibility;
  });

  // Load saved candle colors from localStorage, or fallback to defaults.
  const [candleColors, setCandleColors] = useState(() => {
    const stored = localStorage.getItem("candleColors");
    return stored ? JSON.parse(stored) : defaultCandleColors;
  });

  // State to control options visibility (hidden by default)
  const [showOptions, setShowOptions] = useState(false);

  // Save indicator visibility to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem(
      "indicatorVisibility",
      JSON.stringify(indicatorVisibility)
    );
  }, [indicatorVisibility]);

  // Save candle colors to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem("candleColors", JSON.stringify(candleColors));
  }, [candleColors]);

  // Create the chart and add basic series on mount.
  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: "#f9fafb",
        textColor: "#1a1a1a",
        fontFamily: "'Poppins', sans-serif",
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        rightOffset: 0,
        barSpacing: 3,
        fixLeftEdge: false,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: false,
        borderVisible: false,
        borderColor: "#fff000",
        visible: true,
        timeFormat: {
          type: "time-scale",
          minMove: 1,
        },
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString();
        },
      },
      rightPriceScale: {
        visible: true,
        autoScale: true,
        scaleMargins: {
          top: 0,
          bottom: 0,
        },
      },
      leftPriceScale: {
        visible: true,
      },
    });

    // Add candlestick series.
    candleSeriesRef.current = chartRef.current.addCandlestickSeries({
      priceScaleId: "right",
    });

    // Add volume histogram series (using solVal as volume).
    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: "#26a69a",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // Configure the volume price scale
    chartRef.current.priceScale("volume").applyOptions({
      visible: true,
      scaleMargins: { top: 0.8, bottom: 0 },
      autoScale: true,
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

    // Helper to safely apply price scale options only if the scale exists
    const safelyApplyPriceScaleOptions = (scaleId, options) => {
      try {
        chartRef.current.priceScale(scaleId).applyOptions(options);
      } catch (e) {
        // Price scale doesn't exist yet, silently ignore
      }
    };

    // Auto-scale on scroll/pan
    const handleVisibleTimeRangeChange = () => {
      if (chartRef.current) {
        safelyApplyPriceScaleOptions("right", { autoScale: true });
        safelyApplyPriceScaleOptions("volume", { autoScale: true });
        safelyApplyPriceScaleOptions("last10secVol", { autoScale: true });
        safelyApplyPriceScaleOptions("last5secVol", { autoScale: true });
        safelyApplyPriceScaleOptions("buySellVolume", { autoScale: true });
        safelyApplyPriceScaleOptions("ht", { autoScale: true });
        safelyApplyPriceScaleOptions("totalVolume", { autoScale: true });
        safelyApplyPriceScaleOptions("profitLoss", { autoScale: true });
      }
    };

    return () => {
      chartRef.current
        .timeScale()
        .unsubscribeVisibleTimeRangeChange(handleVisibleTimeRangeChange);
      chartRef.current.remove();
    };
  }, []);

  // Helper function to calculate color based on new_money_ratio
  const getColorFromRatio = (ratio, isUp) => {
    if (ratio === undefined || ratio === null) {
      // Default colors when new_money_ratio is missing
      return {
        upColor: "#336280ff",
        downColor: "#336280ff",
        borderUpColor: "#336280ff",
        borderDownColor: "#336280ff",
        wickUpColor: "#336280ff",
        wickDownColor: "#336280ff",
      };
    }

    // Clamp ratio between 0 and 1
    const clampedRatio = Math.max(0, Math.min(1, ratio));

    let bodyColor;
    let borderColor;

    if (clampedRatio < 0.1) {
      // Use default colors when ratio is below 0.1
      bodyColor = {
        upColor: candleColors.defaultUp,
        downColor: candleColors.defaultDown,
      };
      borderColor = {
        borderUpColor: candleColors.defaultUp,
        borderDownColor: candleColors.defaultDown,
      };
    } else {
      // Determine color based on ratio thresholds
      let color;
      if (clampedRatio >= 0.75) {
        color = candleColors.newMoneyHigh;
      } else if (clampedRatio >= 0.49) {
        color = candleColors.newMoneyMedium;
      } else {
        color = candleColors.newMoneyLow;
      }

      bodyColor = {
        upColor: color,
        downColor: color,
      };

      // Borders match body color
      borderColor = {
        borderUpColor: color,
        borderDownColor: color,
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
          color:
            candle.close >= candle.open ? colors.upColor : colors.downColor,
          borderColor:
            candle.close >= candle.open
              ? colors.borderUpColor
              : colors.borderDownColor,
          wickColor:
            candle.close >= candle.open
              ? colors.wickUpColor
              : colors.wickDownColor,
        };
      });
      candleSeriesRef.current.setData(formattedCandles);

      const formattedVolume = candles.map((candle) => ({
        time: candle.time,
        value: candle.solVal,
        color: candle.close >= candle.open ? "#26a69a" : "#ef5350",
      }));
      volumeSeriesRef.current.setData(formattedVolume);

      // Fit all candles to visible area only on initial load
      if (formattedCandles.length > 0 && isInitialLoadRef.current) {
        // Fit the time scale to show all data from first to last candle
        chartRef.current.timeScale().fitContent();

        // Auto-fit the price scales to show all visible data
        // Only apply to scales that exist (some may not be created yet)
        const scaleIds = [
          "right",
          "volume",
          "last10secVol",
          "last5secVol",
          "buySellVolume",
          "ht",
          "totalVolume",
          "profitLoss",
        ];
        scaleIds.forEach((scaleId) => {
          try {
            chartRef.current.priceScale(scaleId).applyOptions({
              autoScale: true,
            });
          } catch (e) {
            // Price scale doesn't exist yet, silently ignore
          }
        });

        // Mark that initial load is complete
        isInitialLoadRef.current = false;
      }
    }
  }, [candles, candleColors]);

  // For each indicator series, add/remove based on indicatorVisibility.
  // Unrealized Profit
  useEffect(() => {
    if (indicatorVisibility.unrealizedProfit) {
      if (!unrealizedProfitSeriesRef.current) {
        unrealizedProfitSeriesRef.current = chartRef.current.addLineSeries({
          priceScaleId: "profitLoss",
          color: "#0f4a6e",
          lineWidth: 2,
          lineStyle: 0,
        });
      }
      const data = candles
        .filter(
          (candle) =>
            candle.unrealized_profit != null && !isNaN(candle.unrealized_profit)
        )
        .map((candle) => ({
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
          priceScaleId: "profitLoss",
          color: "#6e3d0f",
          lineWidth: 2,
          lineStyle: 0,
        });
      }
      const data = candles
        .filter(
          (candle) =>
            candle.unrealized_loss != null && !isNaN(candle.unrealized_loss)
        )
        .map((candle) => ({
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
          priceScaleId: "profitLoss",
          color: "#9d4e15",
          lineWidth: 2,
          lineStyle: 2,
        });
      }
      const data = candles
        .filter(
          (candle) =>
            candle.realized_loss != null && !isNaN(candle.realized_loss)
        )
        .map((candle) => ({
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
          priceScaleId: "profitLoss",
          color: "#156a9d",
          lineWidth: 2,
          lineStyle: 2,
        });
      }
      const data = candles
        .filter(
          (candle) =>
            candle.realized_profit != null && !isNaN(candle.realized_profit)
        )
        .map((candle) => ({
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
          color: "#dd0808ff",
          lineWidth: 2,
          lineStyle: 0,
        });
        chartRef.current.priceScale("actor_rank").applyOptions({
          visible: true,
          scaleMargins: { top: 0.2, bottom: 0.2 },
        });
      }
      const data = candles
        .filter(
          (candle) => candle.actor_rank != null && !isNaN(candle.actor_rank)
        )
        .map((candle) => ({
          time: candle.time,
          value: candle.actor_rank,
        }));
      actorRankSeriesRef.current.setData(data);
    } else if (actorRankSeriesRef.current) {
      chartRef.current.removeSeries(actorRankSeriesRef.current);
      actorRankSeriesRef.current = null;
    }
  }, [indicatorVisibility.actorRank, candles]);

  // Last 10 Second Volume
  useEffect(() => {
    if (indicatorVisibility.last10secVol) {
      if (!last10secVolSeriesRef.current) {
        last10secVolSeriesRef.current = chartRef.current.addLineSeries({
          priceScaleId: "last10secVol",
          color: "#ff6b35",
          lineWidth: 2,
          lineStyle: 0,
        });
        chartRef.current.priceScale("last10secVol").applyOptions({
          visible: false,
          scaleMargins: { top: 0.1, bottom: 0.1 },
          autoScale: true,
        });
      }
      const data = candles
        .filter(
          (candle) => candle.last10secVol != null && !isNaN(candle.last10secVol)
        )
        .map((candle) => ({
          time: candle.time,
          value: candle.last10secVol,
        }));
      last10secVolSeriesRef.current.setData(data);
    } else if (last10secVolSeriesRef.current) {
      chartRef.current.removeSeries(last10secVolSeriesRef.current);
      last10secVolSeriesRef.current = null;
    }
  }, [indicatorVisibility.last10secVol, candles]);

  // Last 5 Second Volume
  useEffect(() => {
    if (indicatorVisibility.last5secVol) {
      if (!last5secVolSeriesRef.current) {
        last5secVolSeriesRef.current = chartRef.current.addLineSeries({
          priceScaleId: "last5secVol",
          color: "#f7931e",
          lineWidth: 2,
          lineStyle: 1,
        });
        chartRef.current.priceScale("last5secVol").applyOptions({
          visible: false,
          scaleMargins: { top: 0.1, bottom: 0.1 },
          autoScale: true,
        });
      }
      const data = candles
        .filter(
          (candle) => candle.last5secVol != null && !isNaN(candle.last5secVol)
        )
        .map((candle) => ({
          time: candle.time,
          value: candle.last5secVol,
        }));
      last5secVolSeriesRef.current.setData(data);
    } else if (last5secVolSeriesRef.current) {
      chartRef.current.removeSeries(last5secVolSeriesRef.current);
      last5secVolSeriesRef.current = null;
    }
  }, [indicatorVisibility.last5secVol, candles]);

  // Buy Volume
  useEffect(() => {
    if (indicatorVisibility.buyVolume) {
      if (!buyVolumeSeriesRef.current) {
        buyVolumeSeriesRef.current = chartRef.current.addLineSeries({
          priceScaleId: "buySellVolume",
          color: "#00b300",
          lineWidth: 2,
          lineStyle: 0,
        });
        chartRef.current.priceScale("buySellVolume").applyOptions({
          visible: false,
          scaleMargins: { top: 0.1, bottom: 0.1 },
          autoScale: true,
        });
      }
      const data = candles
        .filter(
          (candle) => candle.buy_volume != null && !isNaN(candle.buy_volume)
        )
        .map((candle) => ({
          time: candle.time,
          value: candle.buy_volume,
        }));
      buyVolumeSeriesRef.current.setData(data);
    } else if (buyVolumeSeriesRef.current) {
      chartRef.current.removeSeries(buyVolumeSeriesRef.current);
      buyVolumeSeriesRef.current = null;
    }
  }, [indicatorVisibility.buyVolume, candles]);

  // Sell Volume
  useEffect(() => {
    if (indicatorVisibility.sellVolume) {
      if (!sellVolumeSeriesRef.current) {
        sellVolumeSeriesRef.current = chartRef.current.addLineSeries({
          priceScaleId: "buySellVolume",
          color: "#e60000",
          lineWidth: 2,
          lineStyle: 0,
        });
        chartRef.current.priceScale("buySellVolume").applyOptions({
          visible: false,
          scaleMargins: { top: 0.1, bottom: 0.1 },
          autoScale: true,
        });
      }
      const data = candles
        .filter(
          (candle) => candle.sell_volume != null && !isNaN(candle.sell_volume)
        )
        .map((candle) => ({
          time: candle.time,
          value: candle.sell_volume,
        }));
      sellVolumeSeriesRef.current.setData(data);
    } else if (sellVolumeSeriesRef.current) {
      chartRef.current.removeSeries(sellVolumeSeriesRef.current);
      sellVolumeSeriesRef.current = null;
    }
  }, [indicatorVisibility.sellVolume, candles]);

  // HT Line
  useEffect(() => {
    if (indicatorVisibility.ht) {
      if (!htSeriesRef.current) {
        htSeriesRef.current = chartRef.current.addLineSeries({
          priceScaleId: "ht",
          color: "#8E44AD",
          lineWidth: 2,
          lineStyle: 0,
        });
        chartRef.current.priceScale("ht").applyOptions({
          visible: false,
          scaleMargins: { top: 0.1, bottom: 0.1 },
          autoScale: true,
        });
      }
      const data = candles
        .filter((candle) => candle.ht != null && !isNaN(candle.ht))
        .map((candle) => ({
          time: candle.time,
          value: candle.ht,
        }));
      htSeriesRef.current.setData(data);
    } else if (htSeriesRef.current) {
      chartRef.current.removeSeries(htSeriesRef.current);
      htSeriesRef.current = null;
    }
  }, [indicatorVisibility.ht, candles]);

  // Total Volume Line
  useEffect(() => {
    if (indicatorVisibility.totalVolume) {
      if (!totalVolumeSeriesRef.current) {
        totalVolumeSeriesRef.current = chartRef.current.addLineSeries({
          priceScaleId: "totalVolume",
          color: "#2E86AB",
          lineWidth: 2,
          lineStyle: 0,
        });
        chartRef.current.priceScale("totalVolume").applyOptions({
          visible: false,
          scaleMargins: { top: 0.1, bottom: 0.1 },
          autoScale: true,
        });
      }
      const data = candles
        .filter((candle) => candle.cSolVal != null && !isNaN(candle.cSolVal))
        .map((candle) => ({
          time: candle.time,
          value: candle.cSolVal,
        }));
      totalVolumeSeriesRef.current.setData(data);
    } else if (totalVolumeSeriesRef.current) {
      chartRef.current.removeSeries(totalVolumeSeriesRef.current);
      totalVolumeSeriesRef.current = null;
    }
  }, [indicatorVisibility.totalVolume, candles]);

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

  // Compute the most recent cSolVal and total_fee.
  const recentCSolVal =
    candles && candles.length > 0
      ? Number(candles[candles.length - 1].cSolVal).toFixed(2)
      : "";

  const recentTotalFee =
    candles && candles.length > 0
      ? Number(candles[candles.length - 1].total_fee).toFixed(1)
      : "";

  // Calculate time duration from first candle to now
  const timeDuration =
    candles && candles.length > 0
      ? (() => {
          const firstTime = candles[0].time; // Unix timestamp in seconds
          const nowInSeconds = Math.floor(Date.now() / 1000); // Current time in seconds
          const diffInSeconds = nowInSeconds - firstTime;

          // If 1 hour or more, show "X hr+"
          if (diffInSeconds >= 3600) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hr+`;
          }

          // Otherwise show minutes:seconds
          const minutes = Math.floor(diffInSeconds / 60);
          const seconds = diffInSeconds % 60;
          return `${minutes}:${seconds.toString().padStart(2, "0")}`;
        })()
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
    <div
      className="card"
      style={{
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        border: "none",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {!hideHeader && (
        <ChartHeader
          chartId={chartId}
          name={name}
          symbol={symbol}
          image={image}
          recentCSolVal={recentCSolVal}
          recentTotalFee={recentTotalFee}
          timeDuration={timeDuration}
          handleCopy={handleCopy}
          handleDelete={handleDelete}
        />
      )}
      <div className="card-body" style={{ padding: "24px" }}>
        <div
          ref={chartContainerRef}
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        />

        {/* Show Options Button */}
        <div className="mt-3">
          <button
            className="color-picker-btn"
            onClick={() => setShowOptions(!showOptions)}
            style={{
              padding: "10px 20px",
              background: "#acc7f4ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              fontFamily: "'Poppins', sans-serif",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#2563eb")}
            onMouseLeave={(e) => (e.target.style.background = "#3b82f6")}
          >
            {showOptions ? "Hide Options" : "Options"}
          </button>
        </div>

        {/* Chart Indicators Section - Conditionally Rendered */}
        {showOptions && (
          <div className="mt-4">
            <h6
              className="dashboard-section-title"
              style={{ fontSize: "16px", marginBottom: "16px" }}
            >
              Chart Indicators
            </h6>
            <div className="toggle-group">
              {/* Unrealized Profit */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/Round Graph.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  Unrealized Profit
                  <LineStyleIndicator color="#0f4a6e" lineStyle={0} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="unrealizedProfitCheckbox"
                  checked={indicatorVisibility.unrealizedProfit}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      unrealizedProfit: !indicatorVisibility.unrealizedProfit,
                    })
                  }
                />
              </label>

              {/* Unrealized Loss */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/Round Graph.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  Unrealized Loss
                  <LineStyleIndicator color="#6e3d0f" lineStyle={0} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="unrealizedLossCheckbox"
                  checked={indicatorVisibility.unrealizedLoss}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      unrealizedLoss: !indicatorVisibility.unrealizedLoss,
                    })
                  }
                />
              </label>

              {/* Realized Profit */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/Graph New Up.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  Realized Profit
                  <LineStyleIndicator color="#156a9d" lineStyle={2} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="realizedProfitCheckbox"
                  checked={indicatorVisibility.realizedProfit}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      realizedProfit: !indicatorVisibility.realizedProfit,
                    })
                  }
                />
              </label>

              {/* Realized Loss */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/Graph New Up.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  Realized Loss
                  <LineStyleIndicator color="#9d4e15" lineStyle={2} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="realizedLossCheckbox"
                  checked={indicatorVisibility.realizedLoss}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      realizedLoss: !indicatorVisibility.realizedLoss,
                    })
                  }
                />
              </label>

              {/* Onchain Score */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/Graph New Up.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  Onchain Score
                  <LineStyleIndicator color="#dd0808ff" lineStyle={0} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="actorRankCheckbox"
                  checked={indicatorVisibility.actorRank}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      actorRank: !indicatorVisibility.actorRank,
                    })
                  }
                />
              </label>

              {/* Last 10 Sec Volume */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/Chart Square.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  Last 10 Sec Volume
                  <LineStyleIndicator color="#ff6b35" lineStyle={0} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="last10secVolCheckbox"
                  checked={indicatorVisibility.last10secVol}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      last10secVol: !indicatorVisibility.last10secVol,
                    })
                  }
                />
              </label>

              {/* Last 5 Sec Volume */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/Chart Square.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  Last 5 Sec Volume
                  <LineStyleIndicator color="#f7931e" lineStyle={1} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="last5secVolCheckbox"
                  checked={indicatorVisibility.last5secVol}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      last5secVol: !indicatorVisibility.last5secVol,
                    })
                  }
                />
              </label>

              {/* Buy Volume */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/Dollar Minimalistic.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  Buy Volume
                  <LineStyleIndicator color="#00b300" lineStyle={0} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="buyVolumeCheckbox"
                  checked={indicatorVisibility.buyVolume}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      buyVolume: !indicatorVisibility.buyVolume,
                    })
                  }
                />
              </label>

              {/* Sell Volume */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/Dollar Minimalistic.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  Sell Volume
                  <LineStyleIndicator color="#e60000" lineStyle={0} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="sellVolumeCheckbox"
                  checked={indicatorVisibility.sellVolume}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      sellVolume: !indicatorVisibility.sellVolume,
                    })
                  }
                />
              </label>

              {/* HT */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/Flame-1.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  HT
                  <LineStyleIndicator color="#8E44AD" lineStyle={0} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="htCheckbox"
                  checked={indicatorVisibility.ht}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      ht: !indicatorVisibility.ht,
                    })
                  }
                />
              </label>

              {/* Total Volume */}
              <label className="toggle-item">
                <img
                  src="/figma-assets/icons/wallet.svg"
                  className="toggle-icon"
                  alt=""
                />
                <span>
                  Total Volume
                  <LineStyleIndicator color="#2E86AB" lineStyle={0} />
                </span>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  id="totalVolumeCheckbox"
                  checked={indicatorVisibility.totalVolume}
                  onChange={() =>
                    setIndicatorVisibility({
                      ...indicatorVisibility,
                      totalVolume: !indicatorVisibility.totalVolume,
                    })
                  }
                />
              </label>
            </div>
          </div>
        )}

        {/* Color Pickers Section - Conditionally Rendered */}
        {showOptions && (
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid #dee2e6" }}>
            <h6
              className="dashboard-section-title"
              style={{ fontSize: "16px", marginBottom: "16px" }}
            >
              Candle Colors
            </h6>
            <div className="row">
              {/* Column 1 - Default Candles */}
              <div className="col-4">
                <div className="mb-3">
                  <label
                    className="form-label dashboard-metric-label"
                    style={{
                      fontSize: "13px",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Default Up
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={candleColors.defaultUp.slice(0, 7)}
                    onChange={(e) =>
                      setCandleColors({
                        ...candleColors,
                        defaultUp: e.target.value + "ff",
                      })
                    }
                    title="Choose default up candle color"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="form-label dashboard-metric-label"
                    style={{
                      fontSize: "13px",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Default Down
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={candleColors.defaultDown.slice(0, 7)}
                    onChange={(e) =>
                      setCandleColors({
                        ...candleColors,
                        defaultDown: e.target.value + "ff",
                      })
                    }
                    title="Choose default down candle color"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>

              {/* Column 2 - New Money Candles */}
              <div className="col-4">
                <div className="mb-3">
                  <label
                    className="form-label dashboard-metric-label"
                    style={{
                      fontSize: "13px",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    New Money Low (0.1-0.49)
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={candleColors.newMoneyLow.slice(0, 7)}
                    onChange={(e) =>
                      setCandleColors({
                        ...candleColors,
                        newMoneyLow: e.target.value + "ff",
                      })
                    }
                    title="Choose new money low ratio color"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="form-label dashboard-metric-label"
                    style={{
                      fontSize: "13px",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    New Money Medium (0.49-0.75)
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={candleColors.newMoneyMedium.slice(0, 7)}
                    onChange={(e) =>
                      setCandleColors({
                        ...candleColors,
                        newMoneyMedium: e.target.value + "ff",
                      })
                    }
                    title="Choose new money medium ratio color"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="col-4">
                <div className="mb-3">
                  <label
                    className="form-label dashboard-metric-label"
                    style={{
                      fontSize: "13px",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    New Money High (&gt;= 0.75)
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={candleColors.newMoneyHigh.slice(0, 7)}
                    onChange={(e) =>
                      setCandleColors({
                        ...candleColors,
                        newMoneyHigh: e.target.value + "ff",
                      })
                    }
                    title="Choose new money high ratio color"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="mb-3">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => setCandleColors(defaultCandleColors)}
                    style={{
                      fontWeight: "500",
                      borderRadius: "8px",
                      padding: "8px 16px",
                    }}
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chart;
