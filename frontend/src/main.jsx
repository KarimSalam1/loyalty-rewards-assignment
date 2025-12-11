import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ResetProvider } from "./context/reset/ResetProvider";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import AccountsPage from "./pages/AccountsPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import BatchPage from "./pages/BatchPage.jsx";
import TiersPage from "./pages/TiersPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ResetProvider>
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<AccountsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/batch" element={<BatchPage />} />
            <Route path="/tiers" element={<TiersPage />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </ResetProvider>
  </React.StrictMode>
);
