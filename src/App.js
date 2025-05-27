import React from "react";
import { Routes, Route } from "react-router-dom";
import SingleChartPage from "./SingleChartPage";
import DecorChart from "./DecorChart";

function App() {
  return (
    <Routes>
      <Route path="/single/:id/:token" element={<SingleChartPage />} />
      <Route path="*" element={<DecorChart />} />
    </Routes>
  );
}

export default App;
