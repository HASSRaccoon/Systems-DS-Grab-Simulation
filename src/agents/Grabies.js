import styles from "./styles.module.css";
import React, { useState, useEffect, useRef } from "react";

function Grabies(props) {
  var passengers = [
    {
      id: "passenger1",
      position: { x: 100, y: 100 },
      destination: { x: 190, y: 170 },
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
  ];

  var drivers = [
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
      position: { x: 100, y: 80 },
      destination: { x: 20, y: 10 },
      speed: 5,
      passenger: null,
      state: "SEARCHING",
      happyfactor: 4,
    },
  ];

  const driverRef = useRef(null);
  const passengerRef = useRef(null);

  // function moveTo(ball, position, destination, ballRef) {
  //   const distance = Math.sqrt(
  //     (destination.x - position.x) ** 2 + (destination.y - position.y) ** 2
  //   );
  //   const duration = distance / 50; // adjust the speed of the animation
  //   ball.style.transition = `transform ${duration}s ease-out`;
  //   const xTranslation = Math.min(
  //     destination.x - position.x,
  //     200 - position.x - ballRef.current.offsetWidth
  //   );
  //   const yTranslation = Math.min(
  //     destination.y - position.y,
  //     200 - position.y - ballRef.current.offsetHeight
  //   );
  //   ball.style.transform = `translate(${xTranslation}px, ${yTranslation}px)`;
  //   setTimeout(() => {
  //     position.x += xTranslation;
  //     position.y += yTranslation;
  //   }, duration * 1000);
  // }

  function moveTo(ball, position, destination, ballRef) {
    const distance = Math.sqrt(
      (destination.x - position.x) ** 2 + (destination.y - position.y) ** 2
    );
    const duration = distance / 50; // adjust the speed of the animation
    ball.style.transition = `transform ${duration}s ease-out`;
    const xTranslation = Math.min(
      destination.x - position.x,
      200 - position.x - ballRef.current.offsetWidth
    );
    const yTranslation = Math.min(
      destination.y - position.y,
      200 - position.y - ballRef.current.offsetHeight
    );
    ball.style.transform = `translate(${xTranslation}px, ${yTranslation}px)`;
    ball.style.left = position.x + xTranslation + "px";
    ball.style.top = position.y + yTranslation + "px";
    setTimeout(() => {
      position.x += xTranslation;
      position.y += yTranslation;
    }, duration * 1000);
  }
  useEffect(() => {
    for (let i = 0; i < drivers.length; i++) {
      const driver = drivers[i];
      moveTo(driverRef.current, driver.position, driver.position, driverRef);
      // driverRef.current.style.left = driver.position.x + "px";
      // driverRef.current.style.top = driver.position.y + "px";
    }
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      moveTo(
        passengerRef.current,
        passenger.position,
        passenger.position,
        passengerRef
      );
      // passengerRef.current.style.left = passenger.position.x + "px";
      // passengerRef.current.style.top = passenger.position.y + "px";
    }
  }, []);

  useEffect(() => {
    console.log(drivers, "hello");
    console.log(passengers, "hello2");

    const intervalId = setInterval(() => {
      for (let i = 0; i < drivers.length; i++) {
        const driver = drivers[i];

        switch (driver.state) {
          case "SEARCHING":
            search(driver);
            break;
          case "PICKINGUP":
            if (driver.passenger) {
              pickingup(driver, driver.passenger);
            } else {
              driver.state = "SEARCHING";
            }
            break;
          case "DELIVER":
            if (driver.passenger) {
              deliver(driver, driver.passenger);
            } else {
              driver.state = "SEARCHING";
            }
            break;
          case "COMPLETED":
            if (driver.passenger) {
              completejob(driver, driver.passenger);
            }
            break;
          default:
            console.error(`Unknown driver state: ${driver.state}`);
            break;
        }
      }
    }, 1000);

    const interval2Id = setInterval(() => {
      for (let i = 0; i < passengers.length; i++) {
        const passenger = passengers[i];

        switch (passenger.state) {
          case "WAITING":
            waiting(passenger);
            break;

          case "ARRIVED":
            arrive(passenger);
            console.log(passengers, "before pop");
            passengers.pop(passenger);
            console.log(passengers, "after pop");
            break;

          default:
            console.error(`Unknown passenger state: ${passenger.state}`);
            break;
        }
      }
    }, 1000);

    return () => clearInterval(intervalId) && clearInterval(interval2Id);
  }, [drivers, passengers]);

  function search(driver) {
    //next detail:
    //start timer, when timeElapsed where driver no passenger > driver.tolerance
    //driver disappear or move to new area
    //start timer, when timeElapsed where passenger no driver> passenger.tolerance
    //passenger disappear

    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      // passenger.state = "WAITING";

      if (
        // passenger.state === "WAITING" &&
        passenger.driver === null &&
        passenger.happyfactor < driver.happyfactor
      ) {
        passenger.driver = driver;
        driver.passenger = passenger;
        driver.state = "PICKINGUP";
        console.log(driver.state, "checking pickup state");

        break;
      }
    }
  }
  function waiting(passenger) {
    //start timer, if timeelapsed more than x time,
    //passenger state = cancelled
  }

  function pickingup(driver, passenger) {
    driver.destination = passenger.position;
    driver.speed = passenger.speed;
    moveTo(driverRef.current, driver.position, driver.destination, driverRef);
    console.log(driver.position, "new driver position");
    //when driver reached the passenger, then it will start deliver
    if (
      driver.position.x === passenger.position.x &&
      driver.position.y === passenger.position.y
    ) {
      setTimeout(function () {
        driver.state = "DELIVER";
        // passenger.state = "TRANSIT";
      }, 500);
    }
  }
  function deliver(driver, passenger) {
    driver.destination = passenger.destination;
    console.log(driver.state, "DELIVER");
    console.log(driverRef.current, "hi");
    moveTo(driverRef.current, driver.position, driver.destination, driverRef);
    moveTo(
      passengerRef.current,
      passenger.position,
      passenger.destination,
      passengerRef
    );

    if (
      driver.position.x === passenger.destination.x &&
      driver.position.y === passenger.destination.y
    ) {
      driver.state = "COMPLETED";
    }
  }

  function transit(passenger) {
    if (
      passenger.position.y === passenger.destination.x &&
      passenger.position.y === passenger.destination.y
    ) {
      passenger.state = "ARRIVED";
      console.log(passenger.state);
    }
  }

  function completejob(driver, passenger) {
    driver.passenger = null;

    driver.state = "SEARCHING";
  }
  function arrive(passenger) {
    passenger.driver = null;
    // passengers.pop(passenger);
  }

  return (
    <div>
      <div className={styles.arena}>
        {drivers.map((driver) => (
          <div key={driver.id} className={styles.driver} ref={driverRef} />
        ))}
        {passengers.map((passenger) => (
          <div
            key={passenger.id}
            className={styles.passenger}
            ref={passengerRef}
          ></div>
        ))}
      </div>
      <div> No. of drivers : {drivers.length}</div>
      <div> No. of passengers : {passengers.length}</div>
    </div>
  );
}

export default Grabies;
