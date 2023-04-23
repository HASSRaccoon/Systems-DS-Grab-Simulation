import Driver from "./Agents/driver.js";
import Passenger from "./Agents/passenger.js";
import Globals from "./Agents/globals.js";

import sgJSON from "./data/road-network.json";
import * as turf from "@turf/turf";
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import { useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import exportFromJSON from "export-from-json";
import "./App.css";

export default function App_ruiyang() {
  const location = useLocation();
  console.log("Fast Forward Days: ", location.state.ffwdays);
  console.log("Driver Type: ", location.state.drivertype);
  // const navigate = useNavigate();
  const inputDriverType = location.state.drivertype;
  const inputNumDrivers = location.state.numDrivers;
  const inputNumPassengersPeak = location.state.numPassengersPeak;
  const inputNumPassengersNPeak = location.state.numPassengersNPeak;
  const inputFFW = location.state.ffwdays;

  const DAYS = inputFFW; //1
  const TICKRATE = 1440; //NOTE: 1 tick = 1 minute
  const TICKS = TICKRATE * DAYS;

  const NUM_DRIVERS = inputNumDrivers; //5
  const NUM_PASSENGERS = inputNumPassengersNPeak; //50
  const NUM_PASSENGERS_PEAK = inputNumPassengersPeak; //300
  const PROB_PASSENGERS_CANCEL = 0.05;
  const DRIVER_TYPE = inputDriverType;

  // const simulationIter = 10; //cannot work as the simulation stores the data
  const EXPORT = true;

  const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-5 });

  //CHANGE PER SIMULATION

  let drivers = [];
  const jsonName = "Grabie_Simulation_Output";
  for (let i = 0; i < NUM_DRIVERS; i++) {
    if (DRIVER_TYPE === "A") {
      // Type A
      drivers.push(
        //CHANGE PER SIMULATION
        {
          id: `A${i}`,
          speed: 80,
          state: "searching",
          framesToMove: 0,
          moveRadius: 5,
          startTime: 1020, //NOTE: 5pm
          endTime: 240, //NOTE: 4am
          breakStart: 0, //NOTE: 12am
          breakEnd: 60, //NOTE: 1am
        }
      );
    } else if (DRIVER_TYPE === "B") {
    // //Type B
      drivers.push( //CHANGE PER SIMULATION
              {
                  id: `B${i}`,
                  speed: 90,
                  state: 'searching',
                  framesToMove: 0,
                  moveRadius: 5,
                  startTime: 420, //NOTE: 7am
                  endTime: 1140, //NOTE: 7pm
                  breakStart: 600, //NOTE: 10am
                  breakEnd: 660, //NOTE: 11am
              }
          );
    } else if (DRIVER_TYPE === "C") {
      // //Type C
      drivers.push( //CHANGE PER SIMULATION
              {
                  id: `C${i}`,
                  speed: 70,
                  state: 'searching',
                  framesToMove: 9999999,
                  moveRadius: 0,
                  startTime: 480, //NOTE: 8am
                  endTime: 1080, //NOTE: 6pm
                  breakStart: 660, //NOTE: 10am
                  breakEnd: 720, //NOTE: 11am
              }
          );
    }   
  }
  // Testing: passenger spawns
  // let passengers = [
  //   {
  //     id: "passenger1",
  //     cancelTendency: 1000,
  //     // currentLocation: generateRandomCoord(),
  //     // destination: generateRandomCoord(),
  //   },
  //   {
  //     id: "passenger2",
  //     cancelTendency: 1000,
  //   },
  //   {
  //     id: "passenger3",
  //     cancelTendency: 1000,
  //   },
  //   {
  //     id: "passenger4",
  //     cancelTendency: 1000,
  //   },
  // ];

  let god = new Globals();
  let passengerLs = [];

  // let cancelled = 0; //DEBUG: for debug purpose

  //spawn drivers
  // drivers.map((driver) => driverLs.push(new Driver(driver)));
  drivers.map((driver) => god.registerDriver(new Driver(driver)));

  // passengers.map((passenger) => passengerLs.push(new Passenger(passenger)));

  function buildPath(start, end) {
    const path = pathToGeoJSON(
      pathBuilder.findPath(turf.point(start), turf.point(end))
    );
    return path;
  }

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  function generateString(length) {
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  function assignPassenger(driver) { //Assign passenger to driver if driver is searching
    // console.log('assigning passenger')
    if (passengerLs.length > 0 && driver.state === "searching") {
      let radius = 0;
      // if driver has been searching for less than 5 minutes, search with 2.5km radius, else search with 5km radius
      driver.time < 5
        ? (radius = 2.5)
        : driver.time < 7
        ? (radius = 5)
        : (radius = 7.5);
      driver.radius = radius;
      // console.log( '','radius: ', radius)
      let center = turf.point(driver.currentLocation);
      let options = { steps: 64, units: "kilometers" };
      let circle = turf.circle(center, radius, options); //create circle
      let passengerLsInRadius = passengerLs.filter((passenger) =>
        turf.booleanPointInPolygon(
          turf.point(passenger.currentLocation),
          circle
        )
      ); //filter passenger in circle

      // console.log('Passengers in '+radius+"(km) "+ driver.id + ": ",passengerLsInRadius.length)
      //filter passenger that has shortest distance to driver
      let passengerIndex = null;
      if (passengerLsInRadius.length > 1) {
        let shortestDist = 100000;

        for (let i = 0; i < passengerLsInRadius.length; i++) {
          //loop through passengers in circle
          let currentPassenger = passengerLsInRadius[i];
          let currentDist = turf.distance(
            turf.point(driver.currentLocation),
            turf.point(currentPassenger.currentLocation),
            { units: "kilometers" }
          );
          if (currentDist < shortestDist) {
            shortestDist = currentDist;
            passengerIndex = i;
          }
        }
        if (shortestDist > radius) {
          console.log(
            "(LOG ERROR) shortestDist: ",
            shortestDist,
            "passengerIndex: ",
            passengerIndex
          );
        }
      } else if (passengerLsInRadius.length === 1) {
        passengerIndex = 0;
      } else {
        console.log("Driver", driver.id, "no passengers in radius");
      }

      // Assign passenger to driver
      if (passengerIndex !== null) {
        let currentPassenger = passengerLsInRadius[passengerIndex];
        if (currentPassenger.driver === null) {
          //NOTE: to avoid reassigning passenger to another driver
          driver.passenger = currentPassenger; //assign passenger to driver
          currentPassenger.driver = driver; //assign driver to passenger
          passengerLs = passengerLs.filter(
            (passenger) => passenger.id !== currentPassenger.id
          );
        }
      }
    }
  }


  function newPassenger() { //Generate new passenger
    let passenger = new Passenger({
      id: "passenger" + generateString(7),
      cancelTendency: Math.floor(Math.random() * 10),
    });
    passengerLs.push(passenger);
  }

  function pathGenerator(driver, location, destination) { //Generate path for driver
    if (location === destination || destination === null) return;
    // console.log('pathGenerator driver ', driver.id,' loc: ', location, ' dest: ', destination)
    let path = buildPath(location, destination);
    driver.path = path;
    // console.log('pathGenerator driver ', driver.id,' path: ', path)
    if (
      driver.distanceToTravel === 0 &&
      driver.path !== null &&
      driver.path !== "undefined" &&
      driver.path !== undefined
    ) {
      try {
        driver.distanceToTravel = turf.length(path, { units: "kilometers" });
      } catch (err) {
        console.log(
          "pathGenerator driver ",
          driver.id,
          " path: ",
          path,
          " currentlocation: ",
          driver.currentLocation,
          " destination: ",
          driver.destination
        );
        console.log("(LOG ERROR) pathGenerator: ", err);
      }
    }
  }
  function updateCurrentLoc(driver, location, destination, distance) { //Update driver's current location
    if (location === destination || destination === null) return;

    if (
      driver.path !== null &&
      driver.path !== undefined &&
      driver.path !== "undefined"
    ) {
      let path = driver.path;
      // console.log('Updatecurrentloc driver ', driver.id,' path: ', path)
      let along = turf.along(path, distance, { units: "kilometers" });

      // console.log('along: ', along.geometry.coordinates);
      driver.currentLocation = along.geometry.coordinates;
      // console.log('currentLocation: ', driver.currentLocation);
      if (driver.currentLocation === driver.destination) return;
      let newPath = buildPath(driver.currentLocation, driver.destination);
      driver.path = newPath;
      driver.distanceToTravel = turf.length(path, { units: "kilometers" });
    }
  }

  let driverBucket = []; //NOTE: bucket to store drivers that are available to be assigned to passenger

  function getRandomFromBucket() { //Get random driver from bucket
    var randomIndex = Math.floor(Math.random() * driverBucket.length);
    return driverBucket.splice(randomIndex, 1)[0];
  }

  // --------------------------------- RUN SIMULATION --------------------------------- //
  function runSim() {
    const startDate = new Date(); //NOTE: start time of simulation

    console.log("(LOG) Start Time: ", startDate.toLocaleTimeString());
    for (let ticks = 0; ticks < TICKS; ticks++) {
      console.log("Tick: ", ticks);
      if (ticks % TICKRATE === 0)
        console.log("(LOG) Day: ", 1 + ticks / TICKRATE); //log everyday

      for (var i = 0; i < god.drivers.length; i++) {
        // push drivers to bucket every tick
        driverBucket.push(i);
      }

      try {
        let isPeak = god.checkPeak(ticks);
        let toGenerate = 0;
        if (isPeak) {
          toGenerate = NUM_PASSENGERS_PEAK - passengerLs.length;
        } else {
          toGenerate = NUM_PASSENGERS - passengerLs.length;
        }
        console.log("Number of passenger: ", passengerLs.length);
        if (passengerLs.length < toGenerate) {
          for (let i = 0; i < toGenerate; i++) {
            newPassenger();
          }
        }

        if (ticks % 60 === 0) {
          //NOTE: each hour
          if (Math.random() < 0.5) {
            //NOTE: rain probability
            god.raining = true;
          } else {
            god.raining = false;
          }
        }
        for (let i = 0; i < passengerLs.length; i++) {
          //NOTE: passenger cancelling behaviour
          passengerLs[i].waitingTime += 1;
          if (passengerLs[i].waitingTime >= passengerLs[i].cancelTendency) {
            let cancelRate = Math.random();
            if (
              cancelRate > 1 - PROB_PASSENGERS_CANCEL &&
              passengerLs[i].state === "waiting"
            ) {
              passengerLs[i].cancel();
              // if (passengerLs[i].driver !== null){
              //     passengerLs[i].driver.passenger = null;
              //     passengerLs[i].driver.cancelledJobs += 1;
              //     passengerLs[i].driver.state = "searching";
              // }
              // else{ //DEBUG: for debug purpose
              //     cancelled += 1;
              //     console.log('cancelled: ', cancelled)
              // }
              passengerLs = passengerLs.filter(
                (passenger) => passenger.id !== passengerLs[i].id
              );
            }
          }
        }
        for (let j = 0; j < god.drivers.length; j++) {
          //NOTE: loop for each driver
          let ran_index = getRandomFromBucket(); // NOTE: randomize driver order

          let currentDriver = god.drivers[ran_index];
          if (currentDriver.breakStart < currentDriver.breakEnd) {
            //NOTE: if break is within the day
            if (
              ticks % 1440 >= currentDriver.breakStart &&
              ticks % 1440 <= currentDriver.breakEnd &&
              currentDriver.state === "searching"
            ) {
              //NOTE: Only if driver is no longer on duty
              console.log("break " + currentDriver.id, ticks, "within day");
              currentDriver.time = 0;
              currentDriver.distance = 0;
              continue;
            }
          } else {
            //NOTE: if break is across midnight
            if (
              ticks % 1440 <= currentDriver.breakStart &&
              ticks % 1440 >= currentDriver.breakEnd &&
              currentDriver.state === "searching"
            ) {
              //NOTE: Only if driver is no longer on duty
              console.log("break " + currentDriver.id, ticks, "across days");
              currentDriver.time = 0;
              currentDriver.distance = 0;
              continue;
            }
          }
          if (currentDriver.startTime < currentDriver.endTime) {
            // working hours are within the day
            if (
              ticks % 1440 >= currentDriver.startTime &&
              ticks % 1440 <= currentDriver.endTime
            ) {
              //NOTE: if driver on duty, assign passenger
              if (
                currentDriver.state === "searching" &&
                !currentDriver.passenger
              ) {
                assignPassenger(currentDriver);
              }
            } else {
              if (currentDriver.state === "searching") {
                console.log("break " + currentDriver.id, ticks, "not on duty");
                currentDriver.time = 0;
                currentDriver.distance = 0;
                continue;
              }
            }
          } else {
            // working hours are across midnight
            if (
              ticks % 1440 <= currentDriver.startTime &&
              ticks % 1440 >= currentDriver.endTime
            ) {
              if (currentDriver.state === "searching") {
                console.log("break " + currentDriver.id, ticks, "not on duty");
                currentDriver.time = 0;
                currentDriver.distance = 0;
                continue;
              }
            } else {
              if (
                currentDriver.state === "searching" &&
                !currentDriver.passenger
              ) {
                assignPassenger(currentDriver);
              }
            }
          }
          switch (currentDriver.state) {
            case "searching":
              // let hasMoved = currentDriver.search(currentDriver.passenger, ticks, god);
              // if (hasMoved){
              //     pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination,currentDriver.distancePerTick(currentDriver.speed),true);
              // }currentDriver.search(currentDriver.passenger, ticks,god);
              let isMoving = currentDriver.search(
                currentDriver.passenger,
                ticks,
                god
              );
              // pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
              if (isMoving) {
                updateCurrentLoc(
                  currentDriver,
                  currentDriver.currentLocation,
                  currentDriver.destination,
                  currentDriver.distancePerTick(currentDriver.speed)
                );
              } else {
                pathGenerator(
                  currentDriver,
                  currentDriver.currentLocation,
                  currentDriver.destination
                );
              }
              break;
            case "picking up":
              // let hasPicked = currentDriver.pickUp(ticks,god);
              // currentDriver.passenger.carArrived();
              // if (hasPicked){
              //     pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination,currentDriver.distancePerTick(currentDriver.speed),false);
              // }
              currentDriver.pickUp(ticks, god);
              currentDriver.passenger.carArrived();
              pathGenerator(
                currentDriver,
                currentDriver.currentLocation,
                currentDriver.destination
              );
              break;
            case "transit":
              // let hasReached = currentDriver.transit(ticks,god);
              // currentDriver.passenger.transit();
              // if (hasReached){
              //     pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination,currentDriver.distancePerTick(currentDriver.speed),false);
              // }
              currentDriver.transit(ticks, god);
              currentDriver.passenger.transit();
              pathGenerator(
                currentDriver,
                currentDriver.currentLocation,
                currentDriver.destination
              );

              break;
            case "completed":
              currentDriver.passenger.arrived();
              currentDriver.completed(god);
              break;
            default:
              currentDriver.search(currentDriver.passenger, ticks, god);
              break;
          }
        }
      } catch (e) {
        console.log("(LOG ERROR) Main loop: ", e);
      }
      // if (ticks === TICKS - 1) EXPORT = true;
    }

    let driverlogs = [];
    god.drivers.forEach((driver) => {
      console.log(`${driver.id}'s log: `, driver.log);
      driverlogs.push({
        key: driver.id,
        log: driver.log,
      });
    });

    console.log("driverlogs:", driverlogs);
    // ------------------------------- EXPORT JSON CODE -------------------------------
    if (EXPORT === true) {
      console.log(`(LOG) Sim Completed: Exporting Data as`, jsonName);

      // console.log("drivers:",god.drivers);
      let jsonData = Object.values(driverlogs); // extract value from array object https://github.com/zheeeng/export-from-json/issues/110
      // console.log("data:",data);

      exportFromJSON({
        data: jsonData,
        fileName: jsonName,
        exportType: exportFromJSON.types.json,
      });
    } else {
      console.log("(LOG) Sim Completed: Not Exporting");
    }

    //get current timing
    let endDate = new Date();
    console.log("(LOG) End Time: ", endDate.toLocaleTimeString());
    //get total compute time in minutes
    console.log(
      "(LOG) Total Time: ",
      (endDate.getTime() - startDate.getTime()) / 60000,
      "minutes"
    );
  }

  console.log(`(LOG) Starting Simulation..`);
  runSim();
  return (
    <>
      <div className="app-kewei-header">Thank You For Choosing Us!</div>
      <div className="app-kewei-desc">
        Your data has been downloaded to your local drive!
      </div>
    </>
  );
}

// export default App_ruiyang;
