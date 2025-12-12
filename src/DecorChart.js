import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import DecorHeader from "./DecorHeader";
import Unauthorized from "./components/Unauthorized";
import DataUnavailable from "./components/DataUnavailable";
const TOKEN = "no-auth";

export const NotFound = () => (
  <div className="container text-center py-5">
    <div className="alert alert-warning" role="alert">
      <p className="display-4">Data Available on Dashboard</p>
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
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isDataUnavailable, setIsDataUnavailable] = useState(false);
  const [signalData, setSignalData] = useState(null);

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

        if (chartRes.status === 401 || chartRes.status === 403) {
          setIsUnauthorized(true);
          return;
        }

        if (!chartRes.ok) {
          throw new Error(`HTTP error! status: ${chartRes.status}`);
        }

        const chartJson = await chartRes.json();

        // Check if candles data is missing or empty
        if (!chartJson.data || chartJson.data.length === 0) {
          setIsDataUnavailable(true);
        } else {
          setChartData(chartJson);
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setIsUnauthorized(true);
      }
    };

    fetchData();
  }, [addr]);

  // Update page title when chartData changes
  useEffect(() => {
    if (chartData && chartData.name && chartData.symbol) {
      document.title = `${chartData.name} (${chartData.symbol}) - onchainrank`;
    } else {
      document.title = "onchainrank";
    }
  }, [chartData]);

  // 2) Subscribe to live updates once we have an ID
  useEffect(() => {
    if (!id || isUnauthorized) return;

    const socket = io("https://ws.onchainrank.com", {
      query: { token: TOKEN },
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      if (
        error.message.includes("unauthorized") ||
        error.message.includes("auth")
      ) {
        setIsUnauthorized(true);
      }
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
      if (
        error.message &&
        (error.message.includes("unauthorized") ||
          error.message.includes("auth"))
      ) {
        setIsUnauthorized(true);
      }
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket for single chart.");
      // Subscribe to the specific room for this ID
      socket.emit("subscribe", { room: id });
    });

    socket.on("single", (incomingData) => {
      // Handle signal_data if present
      if (incomingData.signal_data) {
        setSignalData(incomingData.signal_data);
      }

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
          migrated:
            incomingData.migrated !== undefined
              ? incomingData.migrated
              : prevData.migrated,
          image:
            incomingData.image !== undefined
              ? incomingData.image
              : prevData.image,
          name:
            incomingData.name !== undefined ? incomingData.name : prevData.name,
          symbol:
            incomingData.symbol !== undefined
              ? incomingData.symbol
              : prevData.symbol,
          bullx:
            incomingData.bullx !== undefined
              ? incomingData.bullx
              : prevData.bullx,
          hv_wallets_count:
            incomingData.hv_wallets_count !== undefined
              ? incomingData.hv_wallets_count
              : prevData.hv_wallets_count,
          hv_holdings:
            incomingData.hv_holdings !== undefined
              ? incomingData.hv_holdings
              : prevData.hv_holdings,
          hv_avg_profit_only:
            incomingData.hv_avg_profit_only !== undefined
              ? incomingData.hv_avg_profit_only
              : prevData.hv_avg_profit_only,
          fresh_creator_wallet:
            incomingData.fresh_creator_wallet !== undefined
              ? incomingData.fresh_creator_wallet
              : prevData.fresh_creator_wallet,
          creator:
            incomingData.creator !== undefined
              ? incomingData.creator
              : prevData.creator,
        };
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket.");
    });

    return () => {
      socket.emit("unsubscribe", { room: id });
      socket.disconnect();
    };
  }, [id, isUnauthorized]);

  // Merge incoming candles into the existing array.
  const mergeCandles = (existing, incoming) => {
    let merged = [...(existing || [])];
    const incomingArray = incoming || [];

    if (
      merged.length > 0 &&
      incomingArray.length > 0 &&
      merged[merged.length - 1].time === incomingArray[0].time
    ) {
      merged[merged.length - 1] = incomingArray[0];
      incomingArray.forEach((candle, index) => {
        if (index > 0 && (merged.length === 0 || candle.time > merged[merged.length - 1].time)) {
          merged.push(candle);
        }
      });
    } else {
      incomingArray.forEach((candle) => {
        if (merged.length === 0 || candle.time > merged[merged.length - 1].time) {
          merged.push(candle);
        }
      });
    }
    return merged;
  };

  if (notFound) {
    return <NotFound />;
  }

  // Show unauthorized component if authentication fails
  if (isUnauthorized) {
    return <Unauthorized />;
  }

  // Show data unavailable component if no candles data
  if (isDataUnavailable) {
    return <DataUnavailable />;
  }

  // Show a loading state until data is ready
  if (!chartData) {
    return <div>Loading chart...</div>;
  }

  // Compute the most recent values from the last candle
  const recentCSolVal =
    chartData.data && chartData.data.length > 0
      ? Number(chartData.data[chartData.data.length - 1].cSolVal).toFixed(2)
      : "";
  const recentActorRank =
    chartData.data && chartData.data.length > 0
      ? chartData.data[chartData.data.length - 1].actor_rank
      : "";
  const recentTotalFee =
    chartData.data && chartData.data.length > 0
      ? Number(chartData.data[chartData.data.length - 1].total_fee).toFixed(1)
      : "";
  const recentHt =
    chartData.data && chartData.data.length > 0
      ? Number(chartData.data[chartData.data.length - 1].ht).toFixed(2)
      : "";
  const recentClose =
    chartData.data && chartData.data.length > 0
      ? chartData.data[chartData.data.length - 1].close
      : 0;

  // Calculate time duration from first candle to now
  const timeDuration =
    chartData.data && chartData.data.length > 0
      ? (() => {
          const firstTime = chartData.data[0].time; // Unix timestamp in seconds
          const nowInSeconds = Math.floor(Date.now() / 1000); // Current time in seconds
          const diffInSeconds = nowInSeconds - firstTime;

          // If 1 day or more, show "X days"
          if (diffInSeconds >= 86400) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d`;
          }

          // If 1 hour or more, show "X hr"
          if (diffInSeconds >= 3600) {
            const hours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
          }

          // Otherwise show minutes and seconds
          const minutes = Math.floor(diffInSeconds / 60);
          const seconds = diffInSeconds % 60;
          return `${minutes}m ${seconds}s`;
        })()
      : "";

  return (
    <div className="container my-3">
      <DecorHeader
        recentCSolVal={recentCSolVal}
        recentTotalFee={recentTotalFee}
        max_cactor_rank={chartData.max_cactor_rank}
        volRatio={chartData.volRatio}
        recentActorRank={recentActorRank}
        dex_paid={chartData.dex_paid}
        valid_socials={chartData.valid_socials}
        valid_launch={chartData.valid_launch}
        unique_socials={chartData.unique_socials}
        bullx={chartData.bullx}
        bundle_ratio={chartData.bundle_ratio}
        pump_dump_risk={chartData.is_pump_dump_risk}
        total_comments={chartData.total_comments}
        migrated={chartData.migrated}
        name={chartData.name}
        symbol={chartData.symbol}
        image={chartData.image}
        id={id}
        hv_wallets_count={chartData.hv_wallets_count}
        hv_holdings={chartData.hv_holdings}
        hv_avg_profit_only={chartData.hv_avg_profit_only}
        fresh_creator_wallet={chartData.fresh_creator_wallet}
        creator={chartData.creator}
        recentHt={recentHt}
        recentClose={recentClose}
        timeDuration={timeDuration}
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
        signalData={signalData}
      />
    </div>
  );
};

export default DecorChart;
