import React, { useRef, useEffect, useState } from "react";
import { createChart } from "lightweight-charts";
import ChartHeader from "./ChartHeader";
import ChartLegend from "./ChartLegend";

// Helper: convert UNIX timestamp (seconds) to human-readable datetime.
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
  // Series refs for indicator lines:
  const unrealizedProfitSeriesRef = useRef(null);
  const unrealizedLossSeriesRef = useRef(null);
  const realizedLossSeriesRef = useRef(null);
  const realizedProfitSeriesRef = useRef(null);
  const actorRankSeriesRef = useRef(null);

  // --- Indicator Visibility State ---
  const [showUnrealizedProfit, setShowUnrealizedProfit] = useState(true);
  const [showUnrealizedLoss, setShowUnrealizedLoss] = useState(true);
  const [showRealizedLoss, setShowRealizedLoss] = useState(true);
  const [showRealizedProfit, setShowRealizedProfit] = useState(true);
  const [showActorRank, setShowActorRank] = useState(true);

  // --- Chart Creation ---
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

    // Always add candlestick series.
    candleSeriesRef.current = chartRef.current.addCandlestickSeries();

    // Always add volume histogram series (using solVal as volume).
    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: "#26a69a",
      priceFormat: { type: "volume" },
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // Actor Rank series will be conditionally added below.
    // Set up resize listener.
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

  // --- Update Basic Series Data (Candlestick & Volume) ---
  useEffect(() => {
    if (candles && candleSeriesRef.current) {
      const formattedCandles = candles.map((candle) => ({
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));
      candleSeriesRef.current.setData(formattedCandles);

      const formattedVolume = candles.map((candle) => ({
        time: candle.time,
        value: candle.solVal,
        color: candle.close >= candle.open ? "#26a69a" : "#ef5350",
      }));
      volumeSeriesRef.current.setData(formattedVolume);
    }
  }, [candles]);

  // --- Indicator Series Effects ---
  // Unrealized Profit
  useEffect(() => {
    if (showUnrealizedProfit) {
      if (!unrealizedProfitSeriesRef.current) {
        unrealizedProfitSeriesRef.current = chartRef.current.addLineSeries({
          color: "#0f4a6e",
          lineWidth: 2,
          lineStyle: 0,
        });
      }
      const formattedData = candles.map((candle) => ({
        time: candle.time,
        value: candle.unrealized_profit,
      }));
      unrealizedProfitSeriesRef.current.setData(formattedData);
    } else if (unrealizedProfitSeriesRef.current) {
      chartRef.current.removeSeries(unrealizedProfitSeriesRef.current);
      unrealizedProfitSeriesRef.current = null;
    }
  }, [showUnrealizedProfit, candles]);

  // Unrealized Loss
  useEffect(() => {
    if (showUnrealizedLoss) {
      if (!unrealizedLossSeriesRef.current) {
        unrealizedLossSeriesRef.current = chartRef.current.addLineSeries({
          color: "#6e3d0f",
          lineWidth: 2,
          lineStyle: 0,
        });
      }
      const formattedData = candles.map((candle) => ({
        time: candle.time,
        value: candle.unrealized_loss,
      }));
      unrealizedLossSeriesRef.current.setData(formattedData);
    } else if (unrealizedLossSeriesRef.current) {
      chartRef.current.removeSeries(unrealizedLossSeriesRef.current);
      unrealizedLossSeriesRef.current = null;
    }
  }, [showUnrealizedLoss, candles]);

  // Realized Loss
  useEffect(() => {
    if (showRealizedLoss) {
      if (!realizedLossSeriesRef.current) {
        realizedLossSeriesRef.current = chartRef.current.addLineSeries({
          color: "#9d4e15",
          lineWidth: 2,
          lineStyle: 2,
        });
      }
      const formattedData = candles.map((candle) => ({
        time: candle.time,
        value: candle.realized_loss,
      }));
      realizedLossSeriesRef.current.setData(formattedData);
    } else if (realizedLossSeriesRef.current) {
      chartRef.current.removeSeries(realizedLossSeriesRef.current);
      realizedLossSeriesRef.current = null;
    }
  }, [showRealizedLoss, candles]);

  // Realized Profit
  useEffect(() => {
    if (showRealizedProfit) {
      if (!realizedProfitSeriesRef.current) {
        realizedProfitSeriesRef.current = chartRef.current.addLineSeries({
          color: "#156a9d",
          lineWidth: 2,
          lineStyle: 2,
        });
      }
      const formattedData = candles.map((candle) => ({
        time: candle.time,
        value: candle.realized_profit,
      }));
      realizedProfitSeriesRef.current.setData(formattedData);
    } else if (realizedProfitSeriesRef.current) {
      chartRef.current.removeSeries(realizedProfitSeriesRef.current);
      realizedProfitSeriesRef.current = null;
    }
  }, [showRealizedProfit, candles]);

  // Actor Rank
  useEffect(() => {
    if (showActorRank) {
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
      const formattedData = candles.map((candle) => ({
        time: candle.time,
        value: candle.actor_rank,
      }));
      actorRankSeriesRef.current.setData(formattedData);
    } else if (actorRankSeriesRef.current) {
      chartRef.current.removeSeries(actorRankSeriesRef.current);
      actorRankSeriesRef.current = null;
    }
  }, [showActorRank, candles]);

  // --- Horizontal Price Line for probaPrice ---
  useEffect(() => {
    let priceLine = null;
    if (probaPrice && probaPrice !== 0 && candleSeriesRef.current) {
      priceLine = candleSeriesRef.current.createPriceLine({
        price: probaPrice,
        color: "#ff0000", // red color for probaPrice line
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

  // Compute the most recent cSolVal (last candle's cSolVal).
  const recentCSolVal =
    candles && candles.length > 0
      ? Number(candles[candles.length - 1].cSolVal).toFixed(2)
      : "";

  // Copy and delete handlers.
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
        {candles && candles.length > 0 && (
          <small className="text-muted">
            Latest: {formatTimestamp(candles[candles.length - 1].time)}
          </small>
        )}
        <ChartLegend />
        {/* --- Checkbox Controls for Toggling Indicators --- */}
        <div className="mt-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="unrealizedProfitCheckbox"
              checked={showUnrealizedProfit}
              onChange={() => setShowUnrealizedProfit(!showUnrealizedProfit)}
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
              checked={showUnrealizedLoss}
              onChange={() => setShowUnrealizedLoss(!showUnrealizedLoss)}
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
              checked={showRealizedLoss}
              onChange={() => setShowRealizedLoss(!showRealizedLoss)}
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
              checked={showRealizedProfit}
              onChange={() => setShowRealizedProfit(!showRealizedProfit)}
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
              checked={showActorRank}
              onChange={() => setShowActorRank(!showActorRank)}
            />
            <label className="form-check-label" htmlFor="actorRankCheckbox">
              Actor Rank
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chart;
