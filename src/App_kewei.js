import styles from './styles.module.css';
import Driver from './Agents/driver.js';
import Passenger from './Agents/passenger.js';
import Globals from './Agents/globals.js';
import sgJSON from "./road-network.json";
import * as turf from "@turf/turf";
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";

import React, { useState, useEffect, useRef } from "react";

function App() {

  // Functions for map related actions
  // Generate random coordinate
  function generateRandomCoord() {
    let Pos =
      sgJSON.features[Math.floor(Math.random() * sgJSON.features.length)]
        .geometry.coordinates[0];
    return Pos;
  }
  const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });

  // function to build path from json file, start and end points
  function buildPath(start, end) {
    // console.log(start, end);
    const path = pathToGeoJSON(
      pathBuilder.findPath(turf.point(start), turf.point(end))
    );
    return path;
  }

  const start = generateRandomCoord()
  const end = generateRandomCoord()
  console.log('coord',start, end)

  const path =  buildPath(start,end)

  // function to get the length of the path
  console.log('pathlength', turf.length(path))

  const [drivers, setDrivers] = useState([
    {
      id: "driver1",
      currentLocation: [Math.random()*200,Math.random()*200],
      speed: [10,5],
      state: 'searching',
      ref: useRef(null),
      moveTendency: 0.3,
    },
    {
      id: "driver2",
      currentLocation: [Math.random()*200,Math.random()*200],
      speed: [10,5],
      state: 'searching',
      ref: useRef(null),
      moveTendency: 0.8,
    },
  ]);

  const [passengers, setPassengers] = useState([
    {
      id: "passenger1",
      currentLocation: [Math.random()*200,Math.random()*200],
      destination: [Math.random()*200,Math.random()*200],
      ref: useRef(null),
      cancelTendency: 0.05,
    },
    {
      id: "passenger2",
      currentLocation: [Math.random()*200,Math.random()*200],
      destination: [Math.random()*200,Math.random()*200],
      ref: useRef(null),
      cancelTendency: 1,
    },
    {
      id: "passenger3",
      currentLocation: [Math.random()*200,Math.random()*200],
      destination: [Math.random()*200,Math.random()*200],
      ref: useRef(null),
      cancelTendency: 0.01,
    },
    {
      id: "passenger4",
      currentLocation: [Math.random()*200,Math.random()*200],
      destination: [Math.random()*200,Math.random()*200],
      ref: useRef(null),
      cancelTendency: 1,
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

  let god = new Globals();

  let driverLs = []
  let passengerLs = []

  drivers.map((driver) => driverLs.push(new Driver(driver)))
  passengers.map((passenger) => passengerLs.push(new Passenger(passenger)))

  let currentPassenger;

  function spawnDriver() {
    for (let i = 0; i < driverLs.length; i++) {
      let currentDriver = driverLs[i];
      god.registerDriver(currentDriver)
      currentDriver.ref.current.style.left = currentDriver.currentLocation[0] + "px";
      currentDriver.ref.current.style.top = currentDriver.currentLocation[1] + "px";
    }

    for (let i = 0; i < passengerLs.length; i++) {
      let currentPassenger = passengerLs[i];
      currentPassenger.ref.current.style.left = currentPassenger.currentLocation[0] + "px";
      currentPassenger.ref.current.style.top = currentPassenger.currentLocation[1] + "px";
    }
  }

  function assignPassenger(driver) {
    console.log(passengerLs)
    if (passengerLs.length > 0 && driver.state === "searching") {
      let passengerIndex = Math.floor(Math.random() * passengerLs.length);
      currentPassenger = passengerLs[passengerIndex];
      
      if (currentPassenger.driver === null){
        driver.passenger = currentPassenger;
        currentPassenger.driver = driver;
        passengerLs = passengerLs.filter(passenger => passenger.id !== currentPassenger.id)
      }
      else {
        console.log('passenger already has driver')
      }
      
      if (currentPassenger.driver === null || driver.passenger === null){
        console.log(passengerLs)
        console.log('bug');
        assignPassenger(driver)
      }
    }
  }

  useEffect(() => {
    spawnDriver();
  }, []);

  useEffect(() => {
    setInterval(() => {
      // using probability to set is it raining 
      let rainProb = Math.random()
      // console.log(rainProb)
      if (rainProb < 0.5) {
        god.raining = true;
      }
      else {
        god.raining = false;
      }
      for (let i = 0; i < driverLs.length; i++) {
        let currentDriver = driverLs[i];
        assignPassenger(currentDriver)
        for (let i = 0; i < passengerLs.length; i++){
          let passengerRandom = Math.random();
          if (passengerRandom < passengerLs[i].cancelTendency && passengerLs[i].state === 'waiting'){
            console.log('passenger cancelling')
            passengerLs[i].cancel()
            if (passengerLs[i].driver !== null){
              passengerLs[i].driver.passenger = null;
              passengerLs[i].driver.state = "searching"
              passengerLs[i].driver.search(null)
            }
            passengerLs = passengerLs.filter(passenger => passenger.id !== passengerLs[i].id)
          }
        }
          switch (currentDriver.state) {
            case "searching":
                  currentDriver.search(currentDriver.passenger)
                  console.log('searching')
              break;
            case "picking up":
                currentDriver.pickUp()
                currentDriver.passenger.carArrived(Date.now() / 1000 | 0)
              break;
            case "transit":
                currentDriver.transit()
                currentDriver.passenger.transit()
              break;
            case 'completed':
                currentDriver.passenger.arrived()
                currentDriver.completed()
                
              break;
            default:
                currentDriver.search(currentDriver.passenger)
              break;
          }
          
      }
    }, 1500);
  }, [])

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

export default App;
