import React, { useRef, useEffect } from "react";
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

  // Create the chart and add series on mount.
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

    // Add line series with updated colors and styles.
    unrealizedProfitSeriesRef.current = chartRef.current.addLineSeries({
      color: "#0f4a6e", // solid
      lineWidth: 2,
      lineStyle: 0, // solid
    });

    unrealizedLossSeriesRef.current = chartRef.current.addLineSeries({
      color: "#6e3d0f", // solid
      lineWidth: 2,
      lineStyle: 0, // solid
    });

    realizedLossSeriesRef.current = chartRef.current.addLineSeries({
      color: "#9d4e15", // dotted
      lineWidth: 2,
      lineStyle: 2, // dotted
    });

    realizedProfitSeriesRef.current = chartRef.current.addLineSeries({
      color: "#156a9d", // dotted
      lineWidth: 2,
      lineStyle: 2, // dotted
    });

    // Add actor_rank line series with its own price scale.
    actorRankSeriesRef.current = chartRef.current.addLineSeries({
      priceScaleId: "actor_rank",
      color: "#c91483", // solid
      lineWidth: 2,
      lineStyle: 0,
    });
    chartRef.current.priceScale("actor_rank").applyOptions({
      visible: true,

      scaleMargins: { top: 0.2, bottom: 0.2 },
    });

    // Add a resize listener.
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

  // Update series data when candles change.
  useEffect(() => {
    if (candles && candleSeriesRef.current) {
      // Format and update candlestick data.
      const formattedCandles = candles.map((candle) => ({
        time: candle.time, // seconds
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));
      candleSeriesRef.current.setData(formattedCandles);

      // Format and update volume data (using solVal).
      const formattedVolume = candles.map((candle) => ({
        time: candle.time,
        value: candle.solVal,
        color: candle.close >= candle.open ? "#26a69a" : "#ef5350",
      }));
      volumeSeriesRef.current.setData(formattedVolume);

      // Update unrealized_profit.
      const formattedUnrealizedProfit = candles.map((candle) => ({
        time: candle.time,
        value: candle.unrealized_profit,
      }));
      unrealizedProfitSeriesRef.current.setData(formattedUnrealizedProfit);

      // Update unrealized_loss.
      const formattedUnrealizedLoss = candles.map((candle) => ({
        time: candle.time,
        value: candle.unrealized_loss,
      }));
      unrealizedLossSeriesRef.current.setData(formattedUnrealizedLoss);

      // Update realized_loss.
      const formattedRealizedLoss = candles.map((candle) => ({
        time: candle.time,
        value: candle.realized_loss,
      }));
      realizedLossSeriesRef.current.setData(formattedRealizedLoss);

      // Update realized_profit.
      const formattedRealizedProfit = candles.map((candle) => ({
        time: candle.time,
        value: candle.realized_profit,
      }));
      realizedProfitSeriesRef.current.setData(formattedRealizedProfit);

      // Update actor_rank.
      const formattedActorRank = candles.map((candle) => ({
        time: candle.time,
        value: candle.actor_rank,
      }));
      actorRankSeriesRef.current.setData(formattedActorRank);
    }
  }, [candles]);

  // Compute the most recent cSolVal (from the last candle).
  const recentCSolVal =
    candles && candles.length > 0
      ? Number(candles[candles.length - 1].cSolVal).toFixed(2)
      : "";

  // Copy full Chart ID to clipboard.
  const handleCopy = () => {
    navigator.clipboard
      .writeText(chartId)
      .then(() => console.log("Chart ID copied to clipboard"))
      .catch((err) => console.error("Failed to copy chart ID:", err));
  };

  // Delete the chart via API.
  const handleDelete = () => {
    fetch(`http://172.105.175.81:4000delete/${chartId}`, { method: "DELETE" })
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
      </div>
    </div>
  );
}

export default Chart;
