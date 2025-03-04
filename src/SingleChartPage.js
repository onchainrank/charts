import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chart from "./Chart";
import SingleHeader from "./SingleHeader";
import io from "socket.io-client";

const SingleChartPage = () => {
  const { id } = useParams();
  const [chartData, setChartData] = useState(null);

  // Fetch initial data for the selected chart.
  useEffect(() => {
    fetch(`http://172.105.175.81:4000/startup/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // Assume data is a chart object with id, name, symbol, data, updatedAt, image, etc.
        setChartData(data);
      })
      .catch((err) => console.error("Error fetching chart data:", err));
  }, [id]);

  // Subscribe to WebSocket updates for this chart on the 'single' event.
  useEffect(() => {
    const socket = io("http://localhost:4000");
    socket.on("connect", () => {
      console.log("Connected to WebSocket for single chart.");
    });
    socket.on("single", (incomingData) => {
      if (incomingData.id === id) {
        setChartData((prevData) => {
          if (prevData) {
            const mergedData = mergeCandles(prevData.data, incomingData.data);
            return {
              ...prevData,
              data: mergedData,
              updatedAt: incomingData.updatedAt || prevData.updatedAt,
            };
          }
          return prevData;
        });
      }
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket.");
    });
    return () => {
      socket.disconnect();
    };
  }, [id]);

  // Merge incoming candles into the existing array.
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

  if (!chartData) {
    return <div>Loading chart...</div>;
  }

  // Compute the most recent cSolVal from the last candle.
  const recentCSolVal =
    chartData.data && chartData.data.length > 0
      ? Number(chartData.data[chartData.data.length - 1].cSolVal).toFixed(2)
      : "";

  return (
    <div className="container my-3">
      <SingleHeader recentCSolVal={recentCSolVal} />
      <Chart
        chartId={chartData.id}
        name={chartData.name}
        symbol={chartData.symbol}
        candles={chartData.data}
        image={chartData.image}
        onRemove={() => {}}
        hideHeader={true}
      />
    </div>
  );
};

export default SingleChartPage;
