import logo from "./logo.svg";
import "./App.css";
import React from "react";

import Screen from "./pages/Screen";
import Screen2 from "./pages/Screen2";

function App() {
  return (
    <div>
      <div>
        <Screen />
      </div>
      <div>{/* <Screen2></Screen2> */}</div>
    </div>
  );
}

export default App;
