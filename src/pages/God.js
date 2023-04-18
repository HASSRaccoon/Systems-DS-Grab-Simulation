import styles from "./styles.module.css";
import Driver from "./Agents/driver.js";
import Passenger from "./Agents/passenger.js";
import Globals from "./Agents/globals.js";
import React, { useState, useEffect, useRef } from "react";

function God() {
  const [drivers, setDrivers] = useState([
    {
      id: "driver1",
      currentLocation: [Math.random() * 200, Math.random() * 200],
      speed: [10, 5],
      state: "searching",
      ref: useRef(null),
    },
    {
      id: "driver2",
      currentLocation: [Math.random() * 200, Math.random() * 200],
      speed: [10, 5],
      state: "searching",
      ref: useRef(null),
    },
  ]);

  const [passengers, setPassengers] = useState([
    {
      id: "passenger1",
      // currentLocation: [Math.random()*200,Math.random()*200],
      // destination: [Math.random()*200,Math.random()*200],
      currentLocation: [30, 30],
      destination: [100, 100],
      ref: useRef(null),
    },
    {
      id: "passenger2",
      // currentLocation: [Math.random()*200,Math.random()*200],
      // destination: [Math.random()*200,Math.random()*200],
      currentLocation: [70, 90],
      destination: [10, 130],
      ref: useRef(null),
    },
    {
      id: "passenger3",
      // currentLocation: [Math.random()*200,Math.random()*200],
      // destination: [Math.random()*200,Math.random()*200],
      currentLocation: [170, 80],
      destination: [110, 30],
      ref: useRef(null),
    },
  ]);

  function renderd(driver) {
    return (
      <div>
        <div className={styles.driver} ref={driver.ref} />
      </div>
    );
  }

  function renderp(passenger) {
    return (
      <div>
        <div className={styles.passenger} ref={passenger.ref} />
      </div>
    );
  }

  let god = new Globals();

  let driverLs = [];
  let passengerLs = [];

  drivers.map((driver) => driverLs.push(new Driver(driver)));
  passengers.map((passenger) => passengerLs.push(new Passenger(passenger)));

  let currentPassenger;

  function spawnDriver() {
    for (let i = 0; i < driverLs.length; i++) {
      let currentDriver = driverLs[i];
      god.registerDriver(currentDriver);
      currentDriver.ref.current.style.left =
        currentDriver.currentLocation[0] + "px";
      currentDriver.ref.current.style.top =
        currentDriver.currentLocation[1] + "px";
    }

    for (let i = 0; i < passengerLs.length; i++) {
      let currentPassenger = passengerLs[i];
      currentPassenger.ref.current.style.left =
        currentPassenger.currentLocation[0] + "px";
      currentPassenger.ref.current.style.top =
        currentPassenger.currentLocation[1] + "px";
    }
  }

  useEffect(() => {
    spawnDriver();
  }, []);

  useEffect(() => {
    setInterval(() => {
      // using probability to set is it raining
      let rainProb = Math.random();
      // console.log(rainProb)
      if (rainProb < 0.5) {
        god.raining = true;
      } else {
        god.raining = false;
      }
      for (let i = 0; i < driverLs.length; i++) {
        let currentDriver = driverLs[i];
        if (passengerLs.length > 0 && currentDriver.state === "searching") {
          currentPassenger = passengerLs.pop();
          currentDriver.passenger = currentPassenger;
          console.log(currentPassenger.id);
          currentDriver.state = "searching";
        }
        switch (currentDriver.state) {
          case "searching":
            // setTimeout(() => {
            currentDriver.search(currentDriver.passenger);
            // }, 1000);
            break;
          case "picking up":
            // setTimeout(() => {
            currentDriver.pickUp();
            currentDriver.passenger.carArrived(
              (Date.now() / 1000) | 0,
              currentDriver
            );
            // }, 1000);
            break;
          case "transit":
            // setTimeout(() => {
            currentDriver.transit();
            currentDriver.passenger.transit();
            // }, 1000);
            break;
          case "completed":
            // setTimeout(() => {
            currentDriver.passenger.arrived();
            currentDriver.completed();
            // }, 1000);
            break;
          default:
            // setTimeout(() => {
            currentDriver.search(currentDriver.passenger);
            // }, 1000);
            break;
        }
      }
    }, 1500);
  }, []);

  return (
    <div className={styles.App}>
      <div className={styles.arena}>
        {driverLs.map((driver) => renderd(driver))}
        {passengerLs.map((passenger) => renderp(passenger))}
      </div>
      <button onClick={() => god.showStats()}>Show stats</button>
    </div>
  );
}

export default God;
