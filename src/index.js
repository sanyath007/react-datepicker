import React from "react";
import ReactDOM from "react-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";

import Datepicker from "./components/DatePicker";

function App() {
  return (
    <div className="w-25 py-5 my-5 mx-auto">
      <h1>Calendar</h1>
      <Datepicker />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
