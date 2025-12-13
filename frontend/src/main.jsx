import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ResetProvider } from "./context/reset/ResetProvider";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import BatchPage from "./pages/Batch/BatchPage.jsx";
import TiersPage from "./pages/Tiers/TiersPage.jsx";
import LoadingProvider from "./context/loading/LoadingProvider.jsx";
import CreateAccountPage from "./pages/Accounts/CreateAccountPage.jsx";
import ViewAccountPage from "./pages/Accounts/ViewAccountPage.jsx";
import AccountsHomePage from "./pages/Accounts/AccountsHomePage.jsx";
import ViewTransactionsPage from "./pages/Transactions/ViewTransactionsPage.jsx";
import TransactionsHomePage from "./pages/Transactions/TransactionsHomePage.jsx";
import EarnPointsPage from "./pages/Transactions/EarnPointsPage.jsx";
import RedeemPointsPage from "./pages/Transactions/RedeemPointsPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ResetProvider>
      <LoadingProvider>
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/accounts" replace />} />
              <Route path="/accounts" element={<AccountsHomePage />} />
              <Route path="/accounts/create" element={<CreateAccountPage />} />
              <Route path="/accounts/view" element={<ViewAccountPage />} />
              <Route path="/transactions" element={<TransactionsHomePage />} />
              <Route path="/transactions/earn" element={<EarnPointsPage />} />
              <Route
                path="/transactions/redeem"
                element={<RedeemPointsPage />}
              />
              <Route
                path="/transactions/history"
                element={<ViewTransactionsPage />}
              />
              <Route path="/batch" element={<BatchPage />} />
              <Route path="/tiers" element={<TiersPage />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </LoadingProvider>
    </ResetProvider>
  </React.StrictMode>
);
