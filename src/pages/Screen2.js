import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import Driver from "../agents/Driver";
import Passenger from "../agents/Passenger";

function Screen2(props) {
  const [passengers, setPassengers] = useState([
    {
      id: "passenger1",
      position: { x: 100, y: 100 },
      destination: { x: 50, y: 40 },
      happyfactor: 3,
      driver: null,
      speed: 0,
    },
    {
      id: "passenger2",
      position: { x: 140, y: 120 },
      destination: { x: 30, y: 50 },
      happyfactor: 3,
      driver: null,
      speed: 0,
    },
    {
      id: "passenger3",
      position: { x: 160, y: 10 },
      destination: { x: 30, y: 40 },
      happyfactor: 2,
      driver: null,
      speed: 0,
    },
    {
      id: "passenger4",
      position: { x: 20, y: 70 },
      destination: { x: 20, y: 90 },
      happyfactor: 1,
      driver: null,
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
      happyfactor: 4,
    },
    {
      id: "driver2",
      position: { x: 190, y: 100 },
      destination: { x: 60, y: 130 },
      speed: 4,
      passenger: null,
      happyfactor: 3,
    },
    {
      id: "driver3",
      position: { x: 60, y: 50 },
      destination: { x: 160, y: 30 },
      speed: 3,
      passenger: null,
      happyfactor: 2,
    },
  ]);
  console.log(drivers, "hello");
  console.log(passengers, "hello2");

  function search(driver) {
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      if (
        passenger.driver === null &&
        passenger.happyfactor < driver.happyfactor
      ) {
        console.log(driver.happyfactor, "test");
        console.log("passenger found");
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
      deliver(driver, passenger);
    }
  }
  function deliver(driver, passenger) {
    driver.destination = passenger.destination;
    //passenger move together as a unit with driver to destination
    if (
      driver.position.x === passenger.destination.x &&
      driver.position.y === passenger.destination.y &&
      passenger.position.y === passenger.destination.x &&
      passenger.position.y === passenger.destination.y
    ) {
      arrive(passenger);
      completejob(driver);
    }
  }

  function completejob(driver) {
    search(driver);
  }
  function arrive() {
    //passenger disappear
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      for (let i = 0; i < drivers.length; i++) {
        const driver = drivers[i];

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
          />
        ))}
        {passengers.map((passenger) => (
          <Passenger
            key={passenger.id}
            location={passenger.position}
            destination={passenger.destination}
            driver={passenger.driver}
            happyFactor={passenger.happyfactor}
          />
        ))}
      </div>
      <div> No. of drivers : {drivers.length}</div>
      <div> No. of passengers : {passengers.length}</div>
    </div>
  );
}

export default Screen2;
