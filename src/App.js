import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Screen from "./pages/Screen";
import Map from "./component/Map";
import Grabies from "./agents/Grabies";
import Sidebar from "./component/Sidebar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    // <div>
    //   <Router>
    //     <Sidebar />
    //     <Routes>
    //       <Route path="/"></Route>
    //     </Routes>
    //     <Map />

    //     {/* <Screen></Screen> */}
    //   </Router>
    // </div>
    <>
      <div>
        <Sidebar />
        <Map />

        {/* <Routes>
          <Route path="/" element={<Map></Map>} />
        </Routes> */}
      </div>
    </>
  );
}

export default App;
