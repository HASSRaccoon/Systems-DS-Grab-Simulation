import styles from './styles.module.css';
import Driver from './Agents/driver.js';
import Passenger from './Agents/passenger.js';
import React, { useState, useEffect, useRef } from "react";

import { moveTo } from "./Agents/move";

function App() {
  const driverRef = useRef(null);
  const passengerRef = useRef(null);
  const [drivers, setDrivers] = useState([
    {
      id: "driver1",
      currentLocation: [25, 25],
      speed: [10,5],
      state: 'searching',
    },
  ]);

  const [passengers, setPassengers] = useState([
    {
      id: "passenger1",
      currentLocation: [85, 55],
      destination: [135,90],
    },
  ]);

  function render(driver) {
    return (
      <div>
        <div className={styles.driver} ref={driverRef} />
      </div>
    )
  }

  function renderp(passenger) {
    return (
      <div>
        <div className={styles.passenger} ref={passengerRef} />
      </div>
    )
  }

  let d = new Driver(drivers[0])
  let p = new Passenger(passengers[0])

  let driverLs = []
  let passengerLs = []
  driverLs.push(d)
  passengerLs.push(p)

  let workDriver = driverLs[0]
  let workPassenger = passengerLs[0]

  function spawnDriver() {
    driverRef.current.style.left = workDriver.currentLocation[0] + "px";
    driverRef.current.style.top = workDriver.currentLocation[1] + "px";
    passengerRef.current.style.left = p.state.currentLocation[0] + "px";
    passengerRef.current.style.top = p.state.currentLocation[1] + "px";
  }

  useEffect(() => {
    spawnDriver();
    console.log('spawning')
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      switch (workDriver.state) {
        case "searching":
          setTimeout(() => {
            workDriver.search(workDriver, passengerLs[0])
          }, 1000);
          break;
        case "picking up":
          setTimeout(() => {
            workDriver.pickUp()
            moveTo(driverRef.current, workDriver.currentLocation, workDriver.destination, driverRef)
          }, 1000);
          break;
        case "transit":
          setTimeout(() => {
            workDriver.transit()
            moveTo(driverRef.current, workDriver.currentLocation, workDriver.destination, driverRef)
          }, 1000);
          break;
        case 'completed':
          setTimeout(() => {
            workDriver.completed()
          }, 1000);
          passengerLs.pop()
          console.log(passengerLs)
          console.log('hihi', workDriver.state)
          break;
      }

    }, 1000);
  }, [])

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     for (let i = 0; i < drivers.length; i++) {
  //       const driver = drivers[i];

  //       switch (driver.state) {
  //         case "searching":
  //           search(driver, passengers[0]);
  //           // console.log(driver.state.currentLocation)
  //           break;
  //         case "picking up":
  //           pickingup(driver);
  //           console.log(driver.state)
  //           break;
  //         case "DELIVER":
  //           console.log(driver.state)
  //           driver.state = 'searching'
  //           break;
  //         default:
  //           // console.error(`Unknown driver state: ${driver.state}`);
  //           break;
  //       }
  //     }
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, [drivers, passengers]);

  // console.log('debug2')
  // console.log(drivers)

  return (
    <div className={styles.App}>
      <div className={styles.arena}>
        {render(d)}
        {renderp(p)}
      </div>
    </div>
  );
}

export default App;
