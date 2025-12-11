import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ResetProvider } from "./context/reset/ResetProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ResetProvider>
      <App />
    </ResetProvider>
  </React.StrictMode>
);
