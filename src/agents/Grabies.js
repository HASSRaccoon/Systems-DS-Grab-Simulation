import styles from "./styles.module.css";
import React, { useEffect, useRef } from "react";

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
    // {
    //   id: "passenger2",
    //   position: { x: 140, y: 120 },
    //   destination: { x: 30, y: 50 },
    //   happyfactor: 3,
    //   driver: null,
    //   state: "WAITING",
    //   speed: 0,
    // },
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
    // {
    //   id: "driver2",
    //   position: { x: 100, y: 80 },
    //   destination: { x: 20, y: 10 },
    //   speed: 5,
    //   passenger: null,
    //   state: "SEARCHING",
    //   happyfactor: 4,
    // },
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
  //   ball.style.left = position.x + xTranslation + "px";
  //   ball.style.top = position.y + yTranslation + "px";
  //   setTimeout(() => {
  //     position.x += xTranslation;
  //     position.y += yTranslation;
  //   }, duration * 1000);
  // }

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
  //   ball.addEventListener(
  //     "transitionend",
  //     () => {
  //       position.x += xTranslation;
  //       position.y += yTranslation;
  //       ball.style.left = position.x + "px";
  //       ball.style.top = position.y + "px";
  //     },
  //     { once: true }
  //   );
  // }

  function moveTo(ball, position, destination, ballRef) {
    const duration = 1;
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

    ball.style.left = position.x + "px";
    ball.style.top = position.y + "px";
    console.log(position, "before assign");
    position.x += xTranslation;
    position.y += yTranslation;
    console.log(position, "after assign");

    // setTimeout(() => {
    //   position.x += xTranslation;
    //   position.y += yTranslation;
    // }, duration * 100);
  }

  function spawnDriversandPassengers() {
    for (let i = 0; i < drivers.length; i++) {
      const driver = drivers[i];
      driverRef.current.style.left = driver.position.x + "px";
      driverRef.current.style.top = driver.position.y + "px";
    }
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      passengerRef.current.style.left = passenger.position.x + "px";
      passengerRef.current.style.top = passenger.position.y + "px";
    }
  }
  const combinedArray = [
    ...drivers.map((driver) => ({ ...driver, type: "driver" })),
    ...passengers.map((passenger) => ({ ...passenger, type: "passenger" })),
  ];

  function search(driver) {
    //next detail:
    //start timer, when timeElapsed where driver no passenger > driver.tolerance
    //driver disappear or move to new area
    //start timer, when timeElapsed where passenger no driver> passenger.tolerance
    //passenger disappear
    console.log(driver.id, driver.state);
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      if (
        passenger.state === "WAITING" &&
        passenger.driver === null &&
        passenger.happyfactor < driver.happyfactor
      ) {
        passenger.driver = driver;
        driver.passenger = passenger;
        driver.state = "PICKINGUP";
        break;
      }
    }
  }
  function waiting(passenger) {
    //start timer, if timeelapsed more than x time,
    //passenger state = cancelled
    console.log(passenger.id, passenger.state);
  }

  function pickingup(driver, passenger) {
    console.log(driver.id, driver.state);
    driver.destination = passenger.position;
    driver.speed = passenger.speed;
    console.log("driver position before move", driver.position);
    moveTo(driverRef.current, driver.position, driver.destination, driverRef);

    console.log("driver position after move", driver.position);
    if (
      driver.position.x === passenger.position.x &&
      driver.position.y === passenger.position.y
    ) {
      passenger.state = "TRANSIT";
      driver.state = "DELIVER";
    }
  }
  function deliver(driver, passenger) {
    console.log(driver.id, driver.state);

    driver.destination = passenger.destination;

    console.log("driver position", driver.position);
    console.log("driver destination", driver.destination);
    moveTo(driverRef.current, driver.position, driver.destination, driverRef);
    //cheating
    // moveTo(
    //   passengerRef.current,
    //   passenger.position,
    //   passenger.destination,
    //   passengerRef
    // );

    if (
      driver.position.x === passenger.destination.x &&
      driver.position.y === passenger.destination.y
    ) {
      driver.state = "COMPLETED";
    }
  }

  function transit(passenger) {
    console.log(passenger.id, passenger.state, "transitting");
    moveTo(
      passengerRef.current,
      passenger.position,
      passenger.destination,
      passengerRef
    );
    //cheating
    if (
      passenger.position.y === passenger.destination.x &&
      passenger.position.y === passenger.destination.y
    ) {
      passenger.state = "ARRIVED";
      console.log(passenger.state);
    }
  }

  function completejob(driver, passenger) {
    console.log(driver.id, driver.state);
    driver.passenger = null;

    driver.state = "SEARCHING";
  }
  function arrive(passenger) {
    console.log(passenger.id, passenger.state);
    passenger.driver = null;
    console.log(passengers, "before pop");
    passengers.pop(passenger);
    console.log(passengers, "after pop");
    // passengers.pop(passenger);
  }

  useEffect(() => {
    spawnDriversandPassengers();
    console.log(combinedArray, "hello");
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      for (let i = 0; i < combinedArray.length; i++) {
        const obj = combinedArray[i];
        switch (obj.state) {
          case "SEARCHING":
            setTimeout(() => {
              search(obj);
            }, 1000);
            break;
          case "PICKINGUP":
            setTimeout(() => {
              if (obj.type === "driver" && obj.passenger) {
                pickingup(obj, obj.passenger);
              } else {
                obj.state = "SEARCHING";
              }
            }, 1000);
            break;
          case "DELIVER":
            setTimeout(() => {
              if (obj.type === "driver" && obj.passenger) {
                deliver(obj, obj.passenger);
              } else {
                obj.state = "SEARCHING";
              }
            }, 1000);

            break;
          case "COMPLETED":
            setTimeout(() => {
              if (obj.type === "driver" && obj.passenger) {
                completejob(obj, obj.passenger);
              }
            }, 1000);

            break;
          case "WAITING":
            setTimeout(() => {
              if (obj.type === "passenger") {
                waiting(obj);
              }
            }, 1000);

            break;
          case "TRANSIT":
            setTimeout(() => {
              if (obj.type === "passenger") {
                transit(obj);
              }
            }, 1000);

            break;
          case "ARRIVED":
            setTimeout(() => {
              if (obj.type === "passenger") {
                arrive(obj);

                // passengers.splice(passengers.indexOf(obj), 1);
              }
            }, 1000);

            break;
          default:
            console.error(`Unknown state: ${obj.state}`);
            break;
        }
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [combinedArray]);

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
