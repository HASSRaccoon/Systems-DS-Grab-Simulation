import styles from "./styles.module.css";
import React, { useState, useEffect, useRef } from "react";
import { moveTo } from "../utils/moveTo";

function Driver() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [destination, setDestination] = useState({ x: 0, y: 0 });
  const [passenger, setPassenger] = useState(null);
  const [happyFactor, setHappyFactor] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [state, setState] = useState("SEARCHING");
  const ballRef = useRef(null);

  useEffect(() => {
    // setRandomSpawnPosition();
    setRandomDestination();
  }, []);

  // useEffect(() => {
  //   moveTo(destination);
  // }, [destination]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (position.x !== destination.x || position.y !== destination.y) {
        moveTo(ballRef.current, position, destination, ballRef, setPosition);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, [position, destination]);

  function setRandomDestination() {
    const x = Math.floor(Math.random() * 200);
    const y = Math.floor(Math.random() * 200);
    setDestination({ x, y });
  }

  // function setRandomSpawnPosition() {
  //   const x = Math.floor(Math.random() * 200);
  //   const y = Math.floor(Math.random() * 200);
  //   setPosition({ x, y });
  // }

  return (
    <div>
      <div className={styles.driver} ref={ballRef}></div>
    </div>
  );
}

export default Driver;
