import React from "react";
import ReactDOM from "react-dom/client";

import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Map from "./component/Map";
import { MantineProvider } from "@mantine/core";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </MantineProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
