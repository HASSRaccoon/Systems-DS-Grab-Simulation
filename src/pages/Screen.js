import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import Driver from "../agents/Driver";
import Passenger from "../agents/Passenger";
import Grab from "../agents/Grab";

function Screen(props) {
  return (
    <div>
      <div>
        <Grab></Grab>
      </div>
    </div>
  );
}

export default Screen;
