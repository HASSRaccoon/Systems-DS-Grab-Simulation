import styles from "./styles.module.css";
import React, { useState, useEffect, useRef } from "react";

function Passenger(props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [destination, setDestination] = useState({ x: 0, y: 0 });
  const [driver, setDriver] = useState(null);
  const [happyFactor, setHappyFactor] = useState(0);
  const [speed, setSpeed] = useState(1);
  const ballRef = useRef(null);

  useEffect(() => {
    // Set initial position based on position prop
    ballRef.current.style.left = props.location.x + "px";
    ballRef.current.style.top = props.location.y + "px";
  }, [position]);

  return (
    <div>
      <div className={styles.passenger} ref={ballRef}></div>
    </div>
  );
}

export default Passenger;
