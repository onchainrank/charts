import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chart from "./Chart";
import SingleHeader from "./SingleHeader";
import io from "socket.io-client";

const SingleChartPage = () => {
  const { id, token } = useParams();
  const [chartData, setChartData] = useState(null);

  // Fetch initial data for the selected chart.
  useEffect(() => {
    fetch(`https://api.onchainrank.com/startup/${id}/${token}`)
      .then((response) => response.json())
      .then((data) => {
        setChartData(data);
      })
      .catch((err) => console.error("Error fetching chart data:", err));
  }, [id]);

  // Subscribe to WebSocket updates for this chart on the 'single' event.
  useEffect(() => {
    const socket = io(`https://api.onchainrank.com`, { query: { token } });
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
              role:
                incomingData.role !== undefined
                  ? incomingData.role
                  : prevData.role,
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
              nov_wallets_count:
                incomingData.nov_wallets_count !== undefined
                  ? incomingData.nov_wallets_count
                  : prevData.nov_wallets_count,
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
  // Compute the most recent actor_rank from the last candle.
  const recentActorRank =
    chartData.data && chartData.data.length > 0
      ? chartData.data[chartData.data.length - 1].actor_rank
      : "";

  return (
    <div className="container my-3">
      <SingleHeader
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
        role={chartData.role}
        id={id}
        token={token}
        hv_wallets_count={chartData.hv_wallets_count}
        hv_holdings={chartData.hv_holdings}
        hv_avg_profit_only={chartData.hv_avg_profit_only}
        nov_wallets_count={chartData.nov_wallets_count}
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

export default SingleChartPage;
