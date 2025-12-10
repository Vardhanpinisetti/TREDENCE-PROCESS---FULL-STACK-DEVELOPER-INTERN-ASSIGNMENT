import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactFlowProvider } from "reactflow";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  </React.StrictMode>
);
