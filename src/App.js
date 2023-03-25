import styles from './styles.module.css';
import Driver from './Agents/driver.js';
import Passenger from './Agents/passenger.js';
import React, { useState, useEffect, useRef } from "react";

function App() {
  const [drivers, setDrivers] = useState([
    {
      id: "driver1",
      currentLocation: [25, 25],
      speed: [10,5],
      state: 'searching',
      ref: useRef({}),
    },
    {
      id: "driver2",
      currentLocation: [50, 25],
      speed: [10,5],
      state: 'searching',
      ref: useRef({}),
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

  function renderd(driver) {
    return (
      <div>
        <div className={styles.driver} ref={driver.ref} />
      </div>
    )
  }

  function renderp(passenger) {
    return (
      <div>
        <div className={styles.passenger} ref={passenger.ref} />
      </div>
    )
  }

  let driverLs = []
  let passengerLs = []

  drivers.map((driver) => driverLs.push(new Driver(driver)))
  passengers.map((passenger) => passengerLs.push(new Passenger(passenger)))

  let workDriver = driverLs[0]
  let workPassenger = passengerLs[0]

  function spawnDriver() {
    for (let i = 0; i < driverLs.length; i++) {
      let currentDriver = driverLs[i];
      currentDriver.ref.current.style.left = currentDriver.currentLocation[0] + "px";
      currentDriver.ref.current.style.top = currentDriver.currentLocation[1] + "px";
    }

    for (let i = 0; i < passengerLs.length; i++) {
      let currentPassenger = passengerLs[i];
      currentPassenger.ref.current.style.left = currentPassenger.currentLocation[0] + "px";
      currentPassenger.ref.current.style.top = currentPassenger.currentLocation[1] + "px";
    }
  }

  useEffect(() => {
    spawnDriver();
  }, []);

  useEffect(() => {
    setInterval(() => {
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
        {driverLs.map((driver) => renderd(driver))}
        {passengerLs.map((passenger) => renderp(passenger))}
      </div>
    </div>
  );
}

export default App;
