import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import CssBaseline from "@mui/material/CssBaseline";
import Entry from "./Entry";
import { AppProvider } from "./state/app.context";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <AppProvider>
      <Entry />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
