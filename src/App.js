import logo from "./logo.svg";
import "./App.css";
import React from "react";

import Screen from "./pages/Screen";
import Map from "./component/Map";
import Grabies from "./agents/Grabies";

function App() {
  return (
    <div>
      <Map />
      {/* <Screen></Screen> */}
    </div>
  );
}

export default App;
