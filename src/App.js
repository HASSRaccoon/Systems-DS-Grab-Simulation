import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Screen from "./pages/Screen";
import Map from "./component/Map";
import Grabies from "./agents/Grabies";
import Sidebar from "./component/Sidebar";
import * as IoIcons from "react-icons/io5";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StatusDetails } from "./component/StatusDetails";
import { SummarizedSidebar } from "./component/SummarizedSidebar";
// import App_kewei from "./App_kewei";
import { App_kewei } from "./App_kewei";

export default function App() {
  return (
    // <div>
    //   <Router>
    //     <Sidebar />
    //     <Routes>
    //       <Route path="/"></Route>
    //     </Routes>
    //     <Map />

    //     {/* <Screen></Screen> */}
    //   </Router>
    // </div>
    <>
      <div>
 
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/fastforward" element={<App_kewei />} />
          {/* <Map /> */}
          {/* <Sidebar /> */}

          {/* <Routes>
          <Route path="/" element={<Map></Map>} />
        </Routes> */}
        </Routes>
      </div>
    </>
  );
}
// import styles from './styles.module.css';
// import Driver from './Agents/driver.js';
// import Passenger from './Agents/passenger.js';
// import Globals from './Agents/globals.js';
// import React, { useState, useEffect, useRef } from "react";

// function App() {
//   const [drivers, setDrivers] = useState([
//     {
//       id: "driver1",
//       currentLocation: [Math.random()*200,Math.random()*200],
//       speed: [10,5],
//       state: 'searching',
//       ref: useRef(null),
//       moveTendency: 0.3,
//     },
//     {
//       id: "driver2",
//       currentLocation: [Math.random()*200,Math.random()*200],
//       speed: [10,5],
//       state: 'searching',
//       ref: useRef(null),
//       moveTendency: 0.8,
//     },
//   ]);

//   const [passengers, setPassengers] = useState([
//     {
//       id: "passenger1",
//       currentLocation: [Math.random()*200,Math.random()*200],
//       destination: [Math.random()*200,Math.random()*200],
//       ref: useRef(null),
//       cancelTendency: 0.05,
//     },
//     {
//       id: "passenger2",
//       currentLocation: [Math.random()*200,Math.random()*200],
//       destination: [Math.random()*200,Math.random()*200],
//       ref: useRef(null),
//       cancelTendency: 1,
//     },
//     {
//       id: "passenger3",
//       currentLocation: [Math.random()*200,Math.random()*200],
//       destination: [Math.random()*200,Math.random()*200],
//       ref: useRef(null),
//       cancelTendency: 0.01,
//     },
//     {
//       id: "passenger4",
//       currentLocation: [Math.random()*200,Math.random()*200],
//       destination: [Math.random()*200,Math.random()*200],
//       ref: useRef(null),
//       cancelTendency: 1,
//     },
//   ]);

//   function renderd(driver) {
//     return (
//       <div>
//         <div className={styles.driver} ref={driver.ref} />
//       </div>
//     )
//   }

//   function renderp(passenger) {
//     return (
//       <div>
//         <div className={styles.passenger} ref={passenger.ref} />
//       </div>
//     )
//   }

//   let god = new Globals();

//   let driverLs = []
//   let passengerLs = []

//   drivers.map((driver) => driverLs.push(new Driver(driver)))
//   passengers.map((passenger) => passengerLs.push(new Passenger(passenger)))

//   let currentPassenger;

//   function spawnDriver() {
//     for (let i = 0; i < driverLs.length; i++) {
//       let currentDriver = driverLs[i];
//       god.registerDriver(currentDriver)
//       currentDriver.ref.current.style.left = currentDriver.currentLocation[0] + "px";
//       currentDriver.ref.current.style.top = currentDriver.currentLocation[1] + "px";
//     }

//     for (let i = 0; i < passengerLs.length; i++) {
//       let currentPassenger = passengerLs[i];
//       currentPassenger.ref.current.style.left = currentPassenger.currentLocation[0] + "px";
//       currentPassenger.ref.current.style.top = currentPassenger.currentLocation[1] + "px";
//     }
//   }

//   function assignPassenger(driver) {
//     console.log(passengerLs)
//     if (passengerLs.length > 0 && driver.state === "searching") {
//       let passengerIndex = Math.floor(Math.random() * passengerLs.length);
//       currentPassenger = passengerLs[passengerIndex];

//       if (currentPassenger.driver === null){
//         driver.passenger = currentPassenger;
//         currentPassenger.driver = driver;
//         passengerLs = passengerLs.filter(passenger => passenger.id !== currentPassenger.id)
//       }
//       else {
//         console.log('passenger already has driver')
//       }

//       if (currentPassenger.driver === null || driver.passenger === null){
//         console.log(passengerLs)
//         console.log('bug');
//         assignPassenger(driver)
//       }
//     }
//   }

//   useEffect(() => {
//     spawnDriver();
//   }, []);

//   useEffect(() => {
//     setInterval(() => {
//       // using probability to set is it raining
//       let rainProb = Math.random()
//       // console.log(rainProb)
//       if (rainProb < 0.5) {
//         god.raining = true;
//       }
//       else {
//         god.raining = false;
//       }
//       for (let i = 0; i < driverLs.length; i++) {
//         let currentDriver = driverLs[i];
//         assignPassenger(currentDriver)
//         for (let i = 0; i < passengerLs.length; i++){
//           let passengerRandom = Math.random();
//           if (passengerRandom < passengerLs[i].cancelTendency && passengerLs[i].state === 'waiting'){
//             console.log('passenger cancelling')
//             passengerLs[i].cancel()
//             if (passengerLs[i].driver !== null){
//               passengerLs[i].driver.passenger = null;
//               passengerLs[i].driver.state = "searching"
//               passengerLs[i].driver.search(null)
//             }
//             passengerLs = passengerLs.filter(passenger => passenger.id !== passengerLs[i].id)
//           }
//         }
//           switch (currentDriver.state) {
//             case "searching":
//                   currentDriver.search(currentDriver.passenger)
//                   console.log('searching')
//               break;
//             case "picking up":
//                 currentDriver.pickUp()
//                 currentDriver.passenger.carArrived(Date.now() / 1000 | 0)
//               break;
//             case "transit":
//                 currentDriver.transit()
//                 currentDriver.passenger.transit()
//               break;
//             case 'completed':
//                 currentDriver.passenger.arrived()
//                 currentDriver.completed()

//               break;
//             default:
//                 currentDriver.search(currentDriver.passenger)
//               break;
//           }

//       }
//     }, 1500);
//   }, [])

//   return (
//     <div className={styles.App}>
//       <div className={styles.arena}>
//         {driverLs.map((driver) => renderd(driver))}
//         {passengerLs.map((passenger) => renderp(passenger))}
//       </div>
//       <button onClick={() => god.showStats()}>Show stats</button>
//     </div>
//   );
// }

// export default App;
