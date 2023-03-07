import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import Driver from "../agents/Driver";
import Passenger from "../agents/Passenger";

function Screen(props) {
  const [passengers, setPassengers] = useState([
    {
      id: "passenger1",
      position: { x: 100, y: 100 },
      destination: { x: 50, y: 40 },
      happyfactor: 3,
      driver: null,
      state: "WAITING",
      speed: 0,
    },
    {
      id: "passenger2",
      position: { x: 140, y: 120 },
      destination: { x: 30, y: 50 },
      happyfactor: 3,
      driver: null,
      state: "WAITING",
      speed: 0,
    },
    {
      id: "passenger3",
      position: { x: 160, y: 10 },
      destination: { x: 30, y: 40 },
      happyfactor: 2,
      driver: null,
      state: "WAITING",
      speed: 0,
    },
    {
      id: "passenger4",
      position: { x: 20, y: 70 },
      destination: { x: 20, y: 90 },
      happyfactor: 1,
      driver: null,
      state: "WAITING",
      speed: 0,
    },
  ]);
  const [drivers, setDrivers] = useState([
    {
      id: "driver1",
      position: { x: 50, y: 50 },
      destination: { x: 200, y: 100 },
      speed: 5,
      passenger: null,
      state: "SEARCHING",
      happyfactor: 4,
    },
    {
      id: "driver2",
      position: { x: 190, y: 100 },
      destination: { x: 60, y: 130 },
      speed: 4,
      passenger: null,
      state: "SEARCHING",
      happyfactor: 3,
    },
    {
      id: "driver3",
      position: { x: 60, y: 50 },
      destination: { x: 160, y: 30 },
      speed: 3,
      passenger: null,
      state: "SEARCHING",
      happyfactor: 2,
    },
  ]);
  // console.log(drivers, "hello");
  // console.log(passengers, "hello2");

  //function spawnDriver, append to driver list given probability
  //function spawnPassenger, append to passenger list given probability

  function search(driver) {
    //next detail:
    //start timer, when timeElapsed where driver no passenger > driver.tolerance
    //driver disappear or move to new area
    //start timer, when timeElapsed where passenger no driver> passenger.tolerance
    //passenger disappear
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      passenger.state = "WAITING";

      if (
        passenger.driver === null &&
        passenger.happyfactor < driver.happyfactor
      ) {
        console.log(driver.happyfactor, "check");

        driver.state = "PICKINGUP";
        console.log(driver.state);
        pickingup(driver, passenger);
        break;
      }
    }
  }

  function pickingup(driver, passenger) {
    console.log("helpppp");
    passenger.driver = driver;
    driver.passenger = passenger;
    console.log(passenger.driver, driver.passenger, "hi");
    //ok works until here but why driver not moving?
    driver.destination = passenger.position;
    console.log(driver.destination, "new driver destination");
    console.log(driver.position, "new driver position");
    driver.speed = passenger.speed;

    //when driver reached the passenger, then it will start deliver
    if (
      driver.position.x === passenger.position.x &&
      driver.position.y === passenger.position.y
    ) {
      driver.state = "DELIVER";
      deliver(driver, passenger);
      passenger.state = "TRANSIT";
    }
  }
  function deliver(driver, passenger) {
    driver.destination = passenger.destination;
    //passenger move together as a unit with driver to destination
    // console.log(driver.position, "pos");
    // console.log(driver.destination, "des");

    if (
      driver.position.x === passenger.destination.x &&
      driver.position.y === passenger.destination.y &&
      passenger.position.y === passenger.destination.x &&
      passenger.position.y === passenger.destination.y
    ) {
      arrive(passenger);
      passenger.state = "ARRIVED";
      console.log(passenger.state);
      completejob(driver);
    }
  }

  function completejob(driver) {
    search(driver);
    driver.state = "SEARCHING";
  }
  function arrive() {
    //passenger disappear
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      for (let i = 0; i < drivers.length; i++) {
        const driver = drivers[i];
        driver.state = "SEARCHING";

        if (driver.passenger === null) {
          search(driver);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [drivers, passengers]);

  return (
    <div>
      <div className={styles.arena}>
        {drivers.map((driver) => (
          <Driver
            key={driver.id}
            position={driver.position}
            destination={driver.destination}
            speed={driver.speed}
            passenger={driver.passenger}
            happyFactor={driver.happyfactor}
            state={driver.state}
          />
        ))}
        {passengers.map((passenger) => (
          <Passenger
            key={passenger.id}
            location={passenger.position}
            destination={passenger.destination}
            driver={passenger.driver}
            happyFactor={passenger.happyfactor}
            state={passenger.state}
          />
        ))}
      </div>
      <div> No. of drivers : {drivers.length}</div>
      <div> No. of passengers : {passengers.length}</div>
    </div>
  );
}

export default Screen;
