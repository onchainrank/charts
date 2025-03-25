import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import io from "socket.io-client";

function HomePage() {
  // charts: each object has { id, name, symbol, data, updatedAt, image }
  const [charts, setCharts] = useState([]);
  // ignoredIds: IDs of deleted charts.
  const [ignoredIds, setIgnoredIds] = useState([]);

  // Fetch initial data.
  useEffect(() => {
    fetch("https://api.onchainrank.com/startup")
      .then((response) => response.json())
      .then((initialData) => {
        // Sort charts by updatedAt (most recent first).
        const sorted = initialData.sort(
          (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
        );
        setCharts(sorted);
      })
      .catch((err) => console.error("Error fetching startup data:", err));
  }, []);

  // WebSocket subscription.
  useEffect(() => {
    const socket = io("https://api.onchainrank.com");
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("data", (incomingData) => {
      if (ignoredIds.includes(incomingData.id)) return;
      setCharts((prevCharts) =>
        updateChartsWithSocketData(prevCharts, incomingData)
      );
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
    return () => socket.disconnect();
  }, [ignoredIds]);

  const updateChartsWithSocketData = (prevCharts, incomingData) => {
    const { id, data: newCandles, updatedAt } = incomingData;
    const chartsMap = new Map(prevCharts.map((chart) => [chart.id, chart]));
    if (chartsMap.has(id)) {
      const existingChart = chartsMap.get(id);
      const mergedData = mergeCandles(existingChart.data, newCandles);
      chartsMap.set(id, { ...existingChart, data: mergedData, updatedAt });
    } else {
      chartsMap.set(id, {
        id,
        name: incomingData.name || "",
        symbol: incomingData.symbol || "",
        data: newCandles,
        updatedAt,
        image: incomingData.image || "",
      });
    }
    const updatedCharts = Array.from(chartsMap.values());
    updatedCharts.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return updatedCharts;
  };

  const mergeCandles = (existing, incoming) => {
    let merged = [...existing];
    if (
      merged.length > 0 &&
      incoming.length > 0 &&
      merged[merged.length - 1].time === incoming[0].time
    ) {
      merged[merged.length - 1] = incoming[0];
      incoming = incoming.slice(1);
    }
    incoming.forEach((candle) => {
      if (merged.length === 0 || candle.time > merged[merged.length - 1].time) {
        merged.push(candle);
      }
    });
    return merged;
  };

  const removeChart = (id) => {
    setCharts((prev) => prev.filter((chart) => chart.id !== id));
    setIgnoredIds((prev) => [...prev, id]);
  };

  return (
    <div className="container my-3">
      <h1>Real-Time Candlestick Charts</h1>
      {/* Responsive grid: 2 columns per row on md+ screens, 1 per row on small screens */}
      <div className="row row-cols-md-2 row-cols-1 g-2">
        {charts.map((chart) => (
          <div key={chart.id} className="col">
            <Chart
              chartId={chart.id}
              name={chart.name}
              symbol={chart.symbol}
              candles={chart.data}
              image={chart.image}
              onRemove={removeChart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
