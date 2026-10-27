
import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App.jsx";
import CreateMystery from "./pages/CreateMystery.jsx";
import Investigation from "./pages/Investigation.jsx";
import Accusation from "./pages/Accusation.jsx";
import Result from "./pages/Result.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route
          path="/create"
          element={<CreateMystery />}
        />

        <Route
          path="/investigate/:caseId"
          element={<Investigation />}
        />

        <Route
          path="/accuse/:caseId"
          element={<Accusation />}
        />

        <Route
          path="/result/:caseId"
          element={<Result />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
