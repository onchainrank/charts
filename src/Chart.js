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
  const last10secVolSeriesRef = useRef(null);
  const last5secVolSeriesRef = useRef(null);
  const buyVolumeSeriesRef = useRef(null);
  const sellVolumeSeriesRef = useRef(null);
  const htSeriesRef = useRef(null);

  // Define default indicator visibility.
  const defaultIndicatorVisibility = {
    unrealizedProfit: true,
    unrealizedLoss: true,
    realizedLoss: true,
    realizedProfit: true,
    actorRank: true,
    last10secVol: false,
    last5secVol: false,
    buyVolume: false,
    sellVolume: false,
    ht: true,
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
      height: 400,
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#000",
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

    // Auto-scale on scroll/pan
    const handleVisibleTimeRangeChange = () => {
      if (chartRef.current) {
        chartRef.current.priceScale("right").applyOptions({
          autoScale: true,
        });
        chartRef.current.priceScale("volume").applyOptions({
          autoScale: true,
        });
        chartRef.current.priceScale("last10secVol").applyOptions({
          autoScale: true,
        });
        chartRef.current.priceScale("last5secVol").applyOptions({
          autoScale: true,
        });
        chartRef.current.priceScale("buySellVolume").applyOptions({
          autoScale: true,
        });
        chartRef.current.priceScale("ht").applyOptions({
          autoScale: true,
        });
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
  const getColorFromRatio = (ratio) => {
    if (ratio === undefined || ratio === null) {
      // Default colors when new_money_ratio is missing
      return {
        upColor: "#c0e7ffff",
        downColor: "#c0e7ffff",
        borderUpColor: "#c0e7ffff",
        borderDownColor: "#c0e7ffff",
        wickUpColor: "#c0e7ffff",
        wickDownColor: "#c0e7ffff",
      };
    }

    // Clamp ratio between 0 and 1
    const clampedRatio = Math.max(0, Math.min(1, ratio));

    let bodyColor;
    let borderColor;

    if (clampedRatio < 0.1) {
      // Use default colors when ratio is below 0.1
      bodyColor = {
        upColor: "#c0e7ffff",
        downColor: "#c0e7ffff",
      };
      borderColor = {
        borderUpColor: "#c0e7ffff",
        borderDownColor: "#c0e7ffff",
      };
    } else {
      // Determine color based on ratio thresholds
      let color;
      if (clampedRatio >= 0.75) {
        color = "#020438ff"; // Yellow for ratio >= 0.75
      } else if (clampedRatio >= 0.49) {
        color = "#393c8aff"; // Light green for ratio >= 0.49
      } else {
        color = "#535696ff"; // Orange for ratio >= 0.1
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

      // Set visible range to show at least 30 data points
      if (formattedCandles.length > 0) {
        // Auto-fit the price scales to show all visible data
        chartRef.current.priceScale("right").applyOptions({
          autoScale: true,
        });
        chartRef.current.priceScale("volume").applyOptions({
          autoScale: true,
        });
        chartRef.current.priceScale("last10secVol").applyOptions({
          autoScale: true,
        });
        chartRef.current.priceScale("last5secVol").applyOptions({
          autoScale: true,
        });
        chartRef.current.priceScale("buySellVolume").applyOptions({
          autoScale: true,
        });
        chartRef.current.priceScale("ht").applyOptions({
          autoScale: true,
        });
      }
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
          color: "#dd0808ff",
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
      const data = candles.map((candle) => ({
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
      const data = candles.map((candle) => ({
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
      const data = candles.map((candle) => ({
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
      const data = candles.map((candle) => ({
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
      const data = candles.map((candle) => ({
        time: candle.time,
        value: candle.ht,
      }));
      htSeriesRef.current.setData(data);
    } else if (htSeriesRef.current) {
      chartRef.current.removeSeries(htSeriesRef.current);
      htSeriesRef.current = null;
    }
  }, [indicatorVisibility.ht, candles]);

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
          recentTotalFee={recentTotalFee}
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
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="last10secVolCheckbox"
              checked={indicatorVisibility.last10secVol}
              onChange={() =>
                setIndicatorVisibility({
                  ...indicatorVisibility,
                  last10secVol: !indicatorVisibility.last10secVol,
                })
              }
            />
            <label className="form-check-label" htmlFor="last10secVolCheckbox">
              Last 10 Sec Volume
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="last5secVolCheckbox"
              checked={indicatorVisibility.last5secVol}
              onChange={() =>
                setIndicatorVisibility({
                  ...indicatorVisibility,
                  last5secVol: !indicatorVisibility.last5secVol,
                })
              }
            />
            <label className="form-check-label" htmlFor="last5secVolCheckbox">
              Last 5 Sec Volume
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="buyVolumeCheckbox"
              checked={indicatorVisibility.buyVolume}
              onChange={() =>
                setIndicatorVisibility({
                  ...indicatorVisibility,
                  buyVolume: !indicatorVisibility.buyVolume,
                })
              }
            />
            <label className="form-check-label" htmlFor="buyVolumeCheckbox">
              Buy Volume
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="sellVolumeCheckbox"
              checked={indicatorVisibility.sellVolume}
              onChange={() =>
                setIndicatorVisibility({
                  ...indicatorVisibility,
                  sellVolume: !indicatorVisibility.sellVolume,
                })
              }
            />
            <label className="form-check-label" htmlFor="sellVolumeCheckbox">
              Sell Volume
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="htCheckbox"
              checked={indicatorVisibility.ht}
              onChange={() =>
                setIndicatorVisibility({
                  ...indicatorVisibility,
                  ht: !indicatorVisibility.ht,
                })
              }
            />
            <label className="form-check-label" htmlFor="htCheckbox">
              HT
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chart;
