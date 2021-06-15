import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"
import { Bash } from "./components/Bash";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Bash />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
