import styles from './styles.module.css';
import Driver from './Agents/driver.js';
import Passenger from './Agents/passenger.js';
import React, { useState, useEffect, useRef } from "react";

import { moveTo } from "./Agents/move";

function App() {
  // const driverRef = useRef(null);
  // const passengerRef = useRef(null);
  const [drivers, setDrivers] = useState([
    {
      id: "driver1",
      currentLocation: [25, 25],
      speed: [10,5],
      state: 'searching',
      ref: useRef(null),
    },
    {
      id: "driver2",
      currentLocation: [50, 25],
      speed: [10,5],
      state: 'searching',
      ref: useRef(null),
    },
  ]);

  const [passengers, setPassengers] = useState([
    {
      id: "passenger1",
      currentLocation: [85, 55],
      destination: [135,90],
      ref: useRef(null),
    },
  ]);

  function render(driver) {
    console.log(driver)
    for (let i = 0; i < drivers.length; i++) {
      console.log(drivers[i])
      return (
        <div>
          <div className={styles.driver} ref={drivers[i].ref} />
        </div>
      )
    }
  }
    // return (
    //   <div>
    //     <div className={styles.driver} ref={driver.ref} />
    //   </div>
    // )

  function renderp(passenger) {
    return (
      <div>
        <div className={styles.passenger} ref={passenger.ref} />
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
    workDriver.ref.current.style.left = workDriver.currentLocation[0] + "px";
    workDriver.ref.current.style.top = workDriver.currentLocation[1] + "px";
    workPassenger.ref.current.style.left = workPassenger.currentLocation[0] + "px";
    workPassenger.ref.current.style.top = workPassenger.currentLocation[1] + "px";
  }

  useEffect(() => {
    spawnDriver();
    console.log('spawning')
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      switch (workDriver.state) {
        case "searching":
          // NOTE: just to make it dun have errors
          if (passengerLs.length > 0) {
            setTimeout(() => {
              workDriver.search(passengerLs[0])
            }, 1000);
          }
          else {
            console.log('no passenger')
          }
          break;
        case "picking up":
          setTimeout(() => {
            workDriver.pickUp()
            passengerLs[0].carArrived(Date.now() / 1000 | 0, workDriver)
          }, 1000);
          break;
        case "transit":
          setTimeout(() => {
            workDriver.transit()
            passengerLs[0].transit()
          }, 1000);
          break;
        case 'completed':
          setTimeout(() => {
            workDriver.completed()
            passengerLs.pop()
          }, 1000);
          break;
      }
    }, 1000);
  }, [])

  return (
    <div className={styles.App}>
      <div className={styles.arena}>
        {render(drivers.map((driver) => driver))}
        {renderp(p)}
      </div>
    </div>
  );
}

export default App;
