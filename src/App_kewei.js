import Driver from './Agents/driver.js';
import Passenger from './Agents/passenger.js';
import Globals from './Agents/globals.js';
import sgJSON from "./road-network.json";
import * as turf from "@turf/turf";

import PathFinder, { pathToGeoJSON } from "geojson-path-finder";

function App() {
  let days = 1;

  // Functions for map related actions
  const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });

  // function to build path from json file, start and end points
  function buildPath(start, end) {
    const path = pathToGeoJSON(
      pathBuilder.findPath(turf.point(start), turf.point(end))
    );
    return path;
  }

  let drivers = [
    {
        id: "driver1",
        speed: 70,
        state: 'searching',
        moveTendency: 0.3,
    },
    {
        id: "driver2",
        speed: 50,
        state: 'searching',
        moveTendency: 0.8,
    },
  ];

  let passengers = [
    {
        id: "passenger1",
        cancelTendency: 0,
    },
    {
        id: "passenger2",
        cancelTendency: 0,
    },
    {
        id: "passenger3",
        cancelTendency: 0,
    },
    {
        id: "passenger4",
        cancelTendency: 0,
    },
  ];

  let god = new Globals();

  let driverLs = []
  let passengerLs = []

  drivers.map((driver) => driverLs.push(new Driver(driver)))
  passengers.map((passenger) => passengerLs.push(new Passenger(passenger)))

  function assignPassenger(driver) { //DEBUG: need to assign nearest passenger instead of random assignment
    if (passengerLs.length > 0 && driver.state === "searching") {
        let passengerIndex = Math.floor(Math.random() * passengerLs.length); //DEBUG: assigning random passenger part
        let currentPassenger = passengerLs[passengerIndex];
        if (currentPassenger.driver === null){ //NOTE: to avoid reassigning passenger to another driver
            driver.passenger = currentPassenger;
            currentPassenger.driver = driver;
            passengerLs = passengerLs.filter(passenger => passenger.id !== currentPassenger.id) //DEBUG: remove passenger from list
        }
        if (currentPassenger.driver === null || driver.passenger === null){ //DEBUG: for debug purpose
            console.log('bug');
            assignPassenger(driver)
        }
    }
  }

  function newPassenger(){
    let passenger = new Passenger({
        id: "passenger" + passengerLs.length,
        currentLocation: [Math.random()*200,Math.random()*200], //DEBUG: json location
        destination: [Math.random()*200,Math.random()*200], //DEBUG: json location
        cancelTendency: 0,
    })
    passengerLs.push(passenger)
  }

  function pathGenerator(driver, location, destination){
    let path = buildPath(location, destination)
    driver.path = path;
    if (driver.distanceToTravel === 0){
      driver.distanceToTravel = turf.length(path, {units: 'kilometers'})
    }
    console.log(driver.state, driver.distanceToTravel)
  }

  for (let ticks = 0; ticks < 1000 * days; ticks++) {
    // FIXME: how to add new passenger, current is to add new passenger every ticks
    // newPassenger(); 
    if (ticks % 60 == 0){ //NOTE: each hour
        if (Math.random() < 0.5){ //NOTE: rain probability
            god.raining = true;
        }
        else{
            god.raining = false;
        }
    }
    for (let i = 0; i < passengerLs.length; i++){ //NOTE: passenger cancelling
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
    for (let i = 0; i < driverLs.length; i++) { //NOTE: loop for each driver
        let currentDriver = driverLs[i];
        if (ticks % 1440 >= currentDriver.startTime && ticks % 1440 <= currentDriver.endTime){ //NOTE: if driver on duty, assign passenger
            assignPassenger(currentDriver);
        }
        else{
            currentDriver.time = 0;
            currentDriver.distance = 0;
        }
        switch (currentDriver.state) {
            case "searching":
                // console.log('searching')
                currentDriver.search(currentDriver.passenger);
                pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                break;
            case "picking up":
                // console.log('picking up')
                currentDriver.pickUp();
                currentDriver.passenger.carArrived(Date.now() / 1000 | 0);
                pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                break;
            case "transit":
                // console.log('transit')
                currentDriver.transit()
                currentDriver.passenger.transit()
                pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                break;
            case 'completed':
                // console.log('completed')
                currentDriver.passenger.arrived()
                currentDriver.completed()
                break;
            default:
                currentDriver.search(currentDriver.passenger)
                break;
        }
    }
  }

  driverLs.forEach(driver => {
    console.log(`${driver.id}'s log`)
    console.log(driver.log)
  });
}

export default App;

//TODO: output to usable data -> json (KW)
//TODO: add in tick number (check whether peak hour or not) for log (RY)
//TODO: add in list of speed for log (RY)
//TODO: tendency: number of ticks willing to wait passenger cancelling (RY) / driver waiting(KW)