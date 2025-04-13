import React from "react";
import { Routes, Route } from "react-router-dom";
import SingleChartPage from "./SingleChartPage";

function App() {
  return (
    <Routes>
      <Route path="/single/:id" element={<SingleChartPage />} />
    </Routes>
  );
}

export default App;
