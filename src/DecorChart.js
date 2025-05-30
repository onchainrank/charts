import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import DecorHeader from "./DecorHeader";

const TOKEN = "token123";

export const NotFound = () => (
  <div className="container text-center py-5">
    <div className="alert alert-warning" role="alert">
      <h4 className="display-1">Data Available on Dashboard</h4>
      <a
        href="https://onchainrank.com/dashboard"
        className="btn btn-primary mt-3"
      >
        Dashboard
      </a>
    </div>
  </div>
);

const DecorChart = () => {
  // Derive the 'addr' directly from the URL path
  const { pathname } = useLocation();
  const addr = pathname.startsWith("/") ? pathname.slice(1) : pathname;

  // Local state for the resolved ID and the fetched chart data
  const [id, setId] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // 1) Fetch the on-chain ID for the given address, then load the chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step A: Get the ID from the marketing-addr endpoint
        const profileRes = await fetch(
          `https://profile.onchainrank.com/marketing-addr/${addr}`
        );

        if (!profileRes.ok) {
          setNotFound(true);
          return;
        }

        const profileJson = await profileRes.json();
        const fetchedId = profileJson.data.address;
        setId(fetchedId);

        // Step B: Fetch the initial chart payload using the fixed TOKEN
        const chartRes = await fetch(
          `https://api.onchainrank.com/startup/${fetchedId}/${TOKEN}`
        );
        const chartJson = await chartRes.json();
        setChartData(chartJson);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, [addr]);

  // 2) Subscribe to live updates once we have an ID
  useEffect(() => {
    if (!id) return;

    const socket = io("https://api.onchainrank.com", {
      query: { token: TOKEN },
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket for single chart.");
    });

    socket.on("single", (incomingData) => {
      if (incomingData.id === id) {
        setChartData((prevData) => {
          if (!prevData) return prevData;

          const mergedData = mergeCandles(prevData.data, incomingData.data);
          return {
            ...prevData,
            data: mergedData,
            updatedAt: incomingData.updatedAt || prevData.updatedAt,
            max_cactor_rank:
              incomingData.max_cactor_rank !== undefined
                ? incomingData.max_cactor_rank
                : prevData.max_cactor_rank,
            volRatio:
              incomingData.volRatio !== undefined
                ? incomingData.volRatio
                : prevData.volRatio,
            dex_paid:
              incomingData.dex_paid !== undefined
                ? incomingData.dex_paid
                : prevData.dex_paid,
            valid_socials:
              incomingData.valid_socials !== undefined
                ? incomingData.valid_socials
                : prevData.valid_socials,
            valid_launch:
              incomingData.valid_launch !== undefined
                ? incomingData.valid_launch
                : prevData.valid_launch,
            unique_socials:
              incomingData.unique_socials !== undefined
                ? incomingData.unique_socials
                : prevData.unique_socials,
            bundle_ratio:
              incomingData.bundle_ratio !== undefined
                ? incomingData.bundle_ratio
                : prevData.bundle_ratio,
            total_comments:
              incomingData.total_comments !== undefined
                ? incomingData.total_comments
                : prevData.total_comments,
          };
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket.");
    });

    return () => socket.disconnect();
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

  if (notFound) {
    return <NotFound />;
  }
  // Show a loading state until data is ready
  if (!chartData) {
    return <div>Loading chart...</div>;
  }

  // Compute the most recent cSolVal and actor_rank from the last candle
  const recentCSolVal =
    chartData.data && chartData.data.length > 0
      ? Number(chartData.data[chartData.data.length - 1].cSolVal).toFixed(2)
      : "";
  const recentActorRank =
    chartData.data && chartData.data.length > 0
      ? chartData.data[chartData.data.length - 1].actor_rank
      : "";

  return (
    <div className="container my-3">
      <img
        src="/logo.png"
        alt="Logo"
        style={{ height: "24px", width: "auto", marginBottom: "20px" }}
      />
      <DecorHeader
        recentCSolVal={recentCSolVal}
        max_cactor_rank={chartData.max_cactor_rank}
        volRatio={chartData.volRatio}
        recentActorRank={recentActorRank}
        dex_paid={chartData.dex_paid}
        valid_socials={chartData.valid_socials}
        valid_launch={chartData.valid_launch}
        unique_socials={chartData.unique_socials}
        bundle_ratio={chartData.bundle_ratio}
        pump_dump_risk={chartData.is_pump_dump_risk}
        total_comments={chartData.total_comments}
      />
      <Chart
        chartId={chartData.id}
        name={chartData.name}
        symbol={chartData.symbol}
        candles={chartData.data}
        image={chartData.image}
        onRemove={() => {}}
        hideHeader={true}
        probaPrice={chartData.probaPrice}
      />
    </div>
  );
};

export default DecorChart;
