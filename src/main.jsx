import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { LendAndLoanProvider } from "./context/LendAndLoanContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <LendAndLoanProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </LendAndLoanProvider>
  </BrowserRouter>,

  document.getElementById("root")
);
