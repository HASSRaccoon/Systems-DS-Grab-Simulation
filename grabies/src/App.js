import logo from './logo.svg';
import './App.css';
import Driver from './Agents/driver.js';
import Passenger from './Agents/passenger.js';
import React, { useState, useEffect } from "react";

import { moveTo } from "./Agents/move";

function App() {
  const [drivers, setDrivers] = useState([
    {
      id: "driver1",
      currentLocation: [25, 25],
      speed: [3,1],
      state: 'searching',
    },
  ]);

  const [passengers, setPassengers] = useState([
    {
      id: "passenger1",
      currentLocation: [75, 75],
      destination: [200,200],
    },
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      for (let i = 0; i < drivers.length; i++) {
        const driver = drivers[i];

        // setDrivers((drivers) => {
        //   const newDrivers = [...drivers];
        //   newDrivers[i] = driver;
        //   // console.log(newDrivers)
        //   return newDrivers;
        // });
        // driver.changeLocation();

        switch (driver.state) {
          case "searching":
            search(driver, passengers[0]);
            // console.log(driver.state.currentLocation)
            break;
          case "picking up":
            pickingup(driver);
            console.log(driver.state)
            break;
          case "DELIVER":
            console.log(driver.state)
            driver.state = 'searching'
            break;
          default:
            // console.error(`Unknown driver state: ${driver.state}`);
            break;
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [drivers, passengers]);

  // console.log('debug2')
  // console.log(drivers)

  function search(driver, passenger) {
    if (driver.passenger){ 
        // console.log('debug')
        driver.currentLocation = driver.passenger.currentLocation;
        driver.state = 'picking up';
        // console.log(driver)
    }
    else{
        driver.passenger = passenger;
        driver.currentLocation[0] += driver.speed[0];
        driver.currentLocation[1] += driver.speed[1];
        console.log('updated oh yeah')
        // this.waitingTime += 1; //FIXME: need to add the correct timestamp
        // console.log('debug1')
        // console.log(driver)
    }
  }

  function pickingup(driver){
    driver.destination = driver.passenger.destination;
    console.log('===current location===')
    console.log(driver.currentLocation)
    console.log('===destination===')
    console.log(driver.destination)
    
    if (driver.currentLocation[0] >= driver.destination[0] || driver.currentLocation[1] >= driver.destination[1]){
      driver.state='DELIVER';
      driver.passenger = null;
    }
    else{
      driver.currentLocation[0] += driver.speed[0];
      driver.currentLocation[1] += driver.speed[1];
    }
  }

  // let driver = new Driver(3);
  // console.log(driver.state)
  // let dstate, pstate;
  // let driver = new Driver(dstate={speed: 7, location: 7});
  // let passenger = new Passenger(pstate={location: 3, destination: 10});

  // console.log(driver.state)
  // driver.search(passenger);


  // let passenger = new Passenger(3, 10);
  return (
    <div className="App">
      {drivers.map((driver) => (
        <Driver
            key={driver.id}
            currentLocation={driver.currentLocation}
            speed={driver.speed}
          />
        ))}
      {/* <Driver 
        speed={5}
        location={5}
      /> */}
    </div>
  );
}

export default App;
