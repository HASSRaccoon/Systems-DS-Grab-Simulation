// --- (1), (2) & (3): install and import ---
import React, { useEffect, useRef, useState } from "react";
// import ReactDOM  from 'react-dom';
// import sgJSON from "../data/punngol_road_line_new.json";
import sgJSON from "./../data/road-network.json";
import * as turf from "@turf/turf";
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import mapboxgl from "mapbox-gl";
import caricon from "../public/grabcar.png";
import { Button } from "@mantine/core";
// import { Center } from "@mantine/core";
import Driver from "../agents/Driver.js";
import Passenger from "../agents/Passenger.js";
import Globals from "../agents/Globals.js";
// --- ---------------------------------- ---

mapboxgl.accessToken =
  "pk.eyJ1IjoieWVva2V3ZWkiLCJhIjoiY2xlcG5wZ3ZmMGUweTNxdGt4ZG1ldGhsYyJ9.HHNGnKUPolWAo5_UYwzCZg";

export default function Map() {
  function generateRandomCoord() {
    const Pos =
      sgJSON.features[Math.floor(Math.random() * sgJSON.features.length)]
        .geometry.coordinates[0];
    return Pos;
  }

  function buildPath(start, end) {
    // console.log(start, end);
    const path = pathToGeoJSON(
      pathBuilder.findPath(turf.point(start), turf.point(end))
    );
    return path;
  }

  // a function that breaks a path into smaller segments before feeding it to processPath to run the animation
  function aLongJourney(driver) {
    const fullpath = driver.path;
    const startpoint = driver.currentLocation;
    const steps = driver.currentSteps;
    
    const lineDistance = turf.length(fullpath);
    let prevPoint = startpoint;
    
    // driver.counter = 0;

    for (let i = 0; i < steps; i ++) {
      const partialDistance = lineDistance * (i+1) / steps; //incrementally longer distance
      const nextPoint = turf.along(fullpath, partialDistance);
      const subpath = turf.lineSlice(prevPoint, nextPoint, fullpath);
      console.log("moving from ", prevPoint, "to", nextPoint.geometry.coordinates, " as part ", i+1, "of", steps, "partials of the full journey")
      
      takesBabySteps(driver, subpath);
      switch(driver.state) {
        case "searching":
          console.log("Animating searching distance with", subpath.geometry.coordinates.length, "steps")
          animatedriver(driver);
          break;
        case "picking up":
          console.log("Animating picking up distance with", subpath.geometry.coordinates.length, "steps")
          animatedriver(driver);
          break;
        case "transit":
          console.log("Animating transit distance with", subpath.geometry.coordinates.length, "steps")
          animatedriver(driver);
          animatepassenger(driver);
          break;
        default:
          continue;
      }

      prevPoint = nextPoint.geometry.coordinates;
    }

  }

  // pathing between fullpath and subpath having issues!
  function takesBabySteps(driver, subpath) {
    //line Distance is number like 1.512343151
    const lineDistance = turf.length(subpath);

    // console.log(lineDistance, "lineDistance");
    const arc = [];

    for (let i = 0; i < lineDistance; i += lineDistance / 50) {
      const segment = turf.along(subpath, i);
      arc.push(segment.geometry.coordinates);
    }
    arc.push(turf.along(subpath, lineDistance).geometry.coordinates);
    subpath.geometry.coordinates = arc;
  }

  const spawnProbability = 0.5;

  let god = new Globals();
  // console.log(god.checkPeak(new Date())); //check peak hour
  // console.log("fares",god.fareCalculation(0.5,4,new Date())); //check raining

  // console.log("profit", god.profitCalculation(70, 44.5));

  let driver1 = new Driver({
    id: 1,
    currentLocation: generateRandomCoord(),
    speed: 50,
    destination: generateRandomCoord(),
    path: null,
    ref: null,
  });

  let driver2 = new Driver({
    id: 2,
    currentLocation: generateRandomCoord(),
    speed: 70,
    destination: generateRandomCoord(),
    path: null,
    ref: null,
  });

  let driver3 = new Driver({
    id: 3,
    currentLocation: generateRandomCoord(),
    speed: 80,
    destination: generateRandomCoord(),
    path: null,
    ref: null,
  });

  let running = false;

  const [drivers, setDrivers] = useState([driver1, driver2, driver3]);

  let passengerListo = [];

  for (let i = 0; i < 20; i++) {
    passengerListo[i] = new Passenger({
      id: i,
      ref: null,
      destination: generateRandomCoord(),
      currentLocation: generateRandomCoord(),
    });
  }

  const [passengers, setPassengers] = useState(passengerListo);

  function spawnPassengerWithProbability(spawnProbability) {
    setInterval(() => {
      const random = Math.random();
      if (random < spawnProbability) {
        spawnPassenger();
      }
    }, 1000);
  }

  function spawnPassenger() {
    let p = new Passenger({
      id: passengers.length + 1,
      ref: null,
      destination: generateRandomCoord(),
      currentLocation: generateRandomCoord(),
    });
    setPassengers([...passengers, p]);
    console.log(passengers);
    map.getSource("passengers").setData(passengerPoints);
    // console.log(passengers);
  }

  const numPassengers = 10;

  const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(103.807);
  const [lat, setLat] = useState(1.37);
  const [zoom, setZoom] = useState(10.5);

  //default paths on init
  for (let i = 0; i < drivers.length; i++) {
    const driver = drivers[i];
    // console.log(driver.id);
    driver.path = buildPath(driver.currentLocation, driver.destination);
    // const steps = (100 - driver.speed) * 5;
    //replace steps with speed next time
    // processPath(driver.path, steps);
    // console.log(drivers[driver.id - 1], "got path?");
  }

  let driverPoints = {
    type: "FeatureCollection",
    features: drivers.map((driver) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: driver.currentLocation,
        },
        properties: {
          id: driver.id,
        },
      };
    }),
  };

  let passengerPoints = {
    type: "FeatureCollection",
    features: passengers.map((passenger) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: passenger.currentLocation,
        },
        properties: {
          id: passenger.id,
        },
      };
    }),
  };

  let driverPaths = {
    type: "FeatureCollection",
    features: drivers.map((driver) => {
      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: driver.path.geometry.coordinates,
        },
        properties: {
          id: driver.id,
          weight: driver.path.properties.weight,
          edgeDatas: driver.path.properties.edgeDatas,
        },
      };
    }),
  };

  
  function goodMorning(driver){
    // check if driver is starting his day
    if (driver.timeCounter === 0) {
      console.log("start of the day");
      console.log("driver starting from ", driver.currentLocation);
    }    

    const thisTime = driver.timeCounter;
    //start driver timelog
    driver.timeLog[thisTime] = {};
    driver.timeLog[thisTime]["state"] = driver.state;
    driver.timeLog[thisTime]["distance travelled"] =
      driver.distancePerStep;
    driver.timeLog[thisTime]["time passed"] = 1;
    // driver.timeLog[thisTime]["leftover time"] = 0;
    driver.timeLog[thisTime]["speed"] = driver.speed;

    console.log("Initialising timelog with first entry:", driver.timeLog[driver.timeCounter]);

    // finally, start the cycle of handling states with search
    handleSearch(driver);
  }

  function animatedriver(driver) {
    console.log("Starting animation with driver", driver.id, "at time", driver.timeCounter);
    console.log("Checking counter", driver.counter, "out of", driver.currentSteps, "steps");
    // console.log(driver.timeLog, "time log current development");
    const thisTime = driver.timeCounter;
    driver.timeLog[thisTime] = {};

    const start =
      driver.path.geometry.coordinates[
        driver.counter >= driver.currentSteps
          ? driver.counter - 1
          : driver.counter
      ];
    const end =
      driver.path.geometry.coordinates[
        driver.counter >= driver.currentSteps
          ? driver.counter
          : driver.counter + 1
      ];

    if (!start || !end) {
      running = false;
      return;
    }

    driverPoints.features[driver.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[driver.counter];
    //update currentLocation is here
    driver.currentLocation = driver.path.geometry.coordinates[driver.counter];
    driverPoints.features[driver.id - 1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.getSource("drivers").setData(driverPoints);

    // if (driver.counter < driver.currentSteps) {
      // requestAnimationFrame(() => animatedriver(driver, steps));
      // animationId = requestAnimationFrame(() => animatedriver(driver, steps));
      // const animationId = requestAnimationFrame(() => animatedriver(driver));
      // animationIds.push(animationId);
    const animationId = requestAnimationFrame(() => animatedriver(driver));
    animationIds[driver.id - 1].push(animationId);
    // }
    // console.log(driver.counter, driver.currentLocation);

    // maybe need to move this out
    driver.counter = driver.counter + 1;
    driver.timeCounter = driver.timeCounter + 1;

    // TIMECOUNTER INITIALISATION WAS HERE -----------
    // if (driver.counter === driver.currentSteps + 1) {
    try {
      driver.timeLog[thisTime]["distance travelled"] =
        driver.currentLeftoverDistance;
      driver.timeLog[thisTime]["time passed"] =
        driver.currentLeftoverTime;
    // driver.timeLog[thisTime]["leftover distance"] =
    //   driver.currentLeftoverDistance;
    // driver.timeLog[thisTime]["leftover time"] =
    //   driver.currentLeftoverTime;
    }
    catch (e) {
      console.log(e);
      console.log(driver.id, "driver id at", driver.state, "state");
      console.log(driver.timeCounter, "time counter that failed");
      console.log(driver.timeLog, "time log that failed");
    }
    // }
    // console.log(driver.id, driver.timeLog, "time log per frame");
    if (driver.timeCounter === 1440) {
      console.log("end of the day");
      console.log("driver reached destination at ", driver.currentLocation);
    }

    // if (driver.counter === steps) {
    // console.log(driver.currentLocation, "last");
    // }
    // console.log(driver.currentLocation, driver.counter);
  }

  let animationIds = new Array(drivers.length).fill([]);

  function animatepassenger(driver) {
    const start =
      driver.path.geometry.coordinates[
        driver.passenger.counter >= driver.currentSteps
          ? driver.passenger.counter - 1
          : driver.passenger.counter
      ];
    const end =
      driver.path.geometry.coordinates[
        driver.passenger.counter >= driver.currentSteps
          ? driver.passenger.counter
          : driver.passenger.counter + 1
      ];

    if (!start || !end) {
      running = false;
      return;
    }

    passengerPoints.features[driver.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[driver.passenger.counter];

    passengerPoints.features[driver.id - 1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.getSource("passengers").setData(passengerPoints);

    if (driver.passenger.counter < driver.currentSteps) {
      // requestAnimationFrame(() => animatepassenger(driver, steps));
      const animationId = requestAnimationFrame(() => animatepassenger(driver));
      animationIds.push(animationId);

      // const animationId = requestAnimationFrame(() => animatedriver(driver));
      // animationIds[driver.id - 1].push(animationId);
    }

    driver.passenger.counter = driver.passenger.counter + 1;
  }

  function getDistance(path) {
    const lineDistance = turf.length(path);
    const distance = lineDistance.toFixed(2); //eugene: might take out? unless better to have 2dp
    return distance;
  }

  // const distance = 2;
  // const irldistance = 40;
  // const speed = 70;
  // const computertimetaken = 5;

  // esttimeTaken(irldistance, speed);

  function getFares(distance, speed) {
    // const time = esttimeTaken(distance, speed);
    //time = distance/speed
  }

  // const d = new Date();

  // console.log(d, "Date when load");
  function dateToTicks(date) {
    const epochOffset = 621355968000000000;
    const ticksPerMillisecond = 10000;

    const ticks = date.getTime() * ticksPerMillisecond + epochOffset;

    return ticks;
  }

  // function calculateEarning(driver) {}

  // function startGlobalTime() {}
  // let animationId;
  let isRunning = false;
  // function debugStart() {
  //   const driver = drivers[1];
  //   const steps = (100 - driver.speed) * 5;
  //   animatedriver(driver, steps);
  //   isRunning = true;
  // }
  // function debugPause() {
  //   if (animationId) {
  //     // const driver = drivers[1];
  //     // const steps = (100 - driver.speed) * 5;
  //     cancelAnimationFrame(animationId);
  //     isRunning = false;
  //   }
  // }
  // function debugContinue() {
  //   // if (isPaused) {
  //   isRunning = true;
  //   const driver = drivers[1];
  //   const steps = (100 - driver.speed) * 5;
  //   animatedriver(driver, steps);
  //   // }
  // }

  function getFuelCost(distance) {
    const rateperkm = 22.54 / 100;
    const fuelcostperdist = distance * rateperkm;
    //22.54 per 100km
    //22.54/100 per km
    return fuelcostperdist;
  }

  function startAnimation() {
    isRunning = true;
    for (let i = 0; i < drivers.length; i++) {
      let driver = drivers[i];
      driver.counter = 0;
      
      goodMorning(driver);
    }
  }

  function startDriver() {
    let driver = drivers[0];
    driver.counter = 0;
    handleSearch(driver);
  }

  function stopAnimation() {
    console.log(animationIds, "animation ids");
    animationIds.forEach((id) => cancelAnimationFrame(id));
    isRunning = false;
  }

  function stopDriver(driver) {
    console.log(animationIds[driver.id - 1], "animationIds for this driver");
    animationIds[driver.id - 1].forEach((id) => cancelAnimationFrame(id));
  }

  function continueDriver(driver) {
    animatedriver(driver);
  }

  function continueAnimation() {
    if (isRunning === false) {
      for (let i = 0; i < drivers.length; i++) {
        let driver = drivers[i];
        animatedriver(driver); // eugene: this func might be a deeper call, might be more similar to startAnimation instead, where you call handle<state> for each driver instead

        //eugene: might be better for continueAnimation to just toggle a boolean that the main loop is listening to, so continueAnimation is just a toggle, and it does not have any logic on its own
      }
    }
  }

  function timeToSteps(timeMins, driver) {
    const integer = Math.trunc(timeMins);
    const decimal = timeMins - integer;
    const steps = Math.ceil(timeMins);
    driver.currentLeftoverTime = decimal;
    // const steps = timeMins
    // return steps, integer, decimal;
    return steps;
  }

  function distanceperStep(speed, steps, distance, driver) {
    console.log(driver.state, distance, "distance");

    console.log(steps, "steps");
    const speedpermin = speed / 60;
    console.log(speedpermin, "distanceperstep");
    const leftoverdistance = distance - speedpermin * (steps - 1);
    console.log(leftoverdistance, "leftoverdistance");
    driver.currentLeftoverDistance = leftoverdistance;
    // const distperstep = 0;
    return speedpermin;
  }

  function esttimeTaken(distance, speed) {
    const estimatedTimeMin = (distance / speed) * 60;
    console.log(estimatedTimeMin, "est time taken");
    return estimatedTimeMin;
    //time = distance/speed
  }

  function handleSearch(driver) {
    //initialising variables
    const initialTime = driver.timeCounter;
    const initialLocation = driver.currentLocation;
    const initialDistance = getDistance(driver.path);
    const estTimeMin = esttimeTaken(initialDistance, driver.speed);

    let getPassengerTime = 0;
    driver.counter = 0;

    //build a fresh log entry for this driver with searching segment
    driver.Log[driver.completedJobs] = {};
    driver.Log[driver.completedJobs]["searching"] = {};
    
    //affecting the driver object
    driver.currentSteps = timeToSteps(estTimeMin, driver);
    driver.distancePerStep = distanceperStep(
      driver.speed,
      driver.currentSteps,
      initialDistance,
      driver
    );

    //actual searching responsibility, found and assigned passenger to driver
    if (passengers.length > 1 && driver.state === "searching") {
      driver.passenger = passengers[driver.id]; //assigned passenger to driver
      driver.search(driver.passenger); //assigned the next state "picking up" state to driver, announce in console

      console.log("this is the passengers array: ", passengers);
      console.log("driver id you are checking: ", driver.id, ", which translates to the passenger he is carrying by his id: ", driver.passenger.id);

      getPassengerTime = driver.timeCounter;
      driver.Log[driver.completedJobs]["searching"]["timeFound"] =
        getPassengerTime;
    }
    else {
      //TODO: if no passengers, then driver should be assigned to a searching location (or not) and then the cycle can push driver to move around within handleSearch, otherwise we are animating otherwise picking up path in searching, which can be confusion
      console.log(driver.destination, "before");
      driver.destination = generateRandomCoord();
      console.log(driver.destination, "after");
      driver.path = buildPath(driver.currentLocation, driver.destination);

      // 
      aLongJourney(driver);

      driverPaths.features[driver.id - 1] = driver.path;
      map.getSource("routes").setData(driverPaths);
    }

    // LOGIC TO REMEMBER: once passenger is given, the driver will just move to the passenger's location, the driver would not run along its originally set path to the searching location
    //show searching path travelling
    // this builds the path from the driver's spawn/completed location to the designated searching point/area
    // driver.path = buildPath(driver.currentLocation, driver.destination);
    // const newdistance = getDistance(driver.path);
    // const newestTimeMin = esttimeTaken(newdistance, driver.speed);
    // driver.currentSteps = timeToSteps(newestTimeMin, driver);
    
    //the actual animation call to move the driver to the searching location
    // the only animation line to move from existence to the new searching location, 
    // aLongJourney(driver); 

    // driver.distancePerStep = distanceperStep(
    //   driver.speed,
    //   driver.currentSteps,
    //   newdistance,
    //   driver
    // );
    // driverPaths.features[driver.id - 1] = driver.path;

    //populating the fresh log entry
    driver.Log[driver.completedJobs]["searching"]["distance"] =
      driver.timeLog[driver.timeCounter]["distance travelled"];
    driver.Log[driver.completedJobs]["searching"]["fuel cost"] = 
      getFuelCost(driver.timeLog[driver.timeCounter]["distance travelled"]);
    driver.Log[driver.completedJobs]["searching"]["duration"] =
      getPassengerTime - initialTime;
    
    //console log the driver's log entry
    console.log(driver.id, driver.Log, "Searching Log");
    
    //preparing to move to the next state
    if (driver.state === "picking up" && driver.passenger != null
      // isRunning === true
    ) {
      console.log("driver", driver.id, "is now picking up passenger");
      handlePickup(driver);
    }
    
  }

  function handlePickup(driver) {
    //start time
    const initialTime = driver.timeCounter;
    
    //affecting the driver object, doing this first to execute search's given path
    // this builds the path from the driver's stale/completed location to the passenger's location
    driver.path = buildPath(driver.currentLocation, driver.destination);
    const newdistance = getDistance(driver.path);
    const newestTimeMin = esttimeTaken(newdistance, driver.speed);
    driver.currentSteps = timeToSteps(newestTimeMin, driver);
    
    //the actual animation call to move the driver to the searching location
    // the only animation line to move from searching place to pick up new passenger
    aLongJourney(driver); 

    driver.distancePerStep = distanceperStep(
      driver.speed,
      driver.currentSteps,
      newdistance,
      driver
    );
    driverPaths.features[driver.id - 1] = driver.path;
    
    // ---------now picking up is complete, bottom is largely logging of picking up activity---------
    //initialising variables
    map.getSource("routes").setData(driverPaths);
    // ?? there was nothing affecting driver.timeCounter after setting initialTime
    const finishTime = driver.timeCounter;
    const pickupDistance = getDistance(driver.path);

    //updating the fresh log entry for this driver with picking up segment
    driver.Log[driver.completedJobs]["pickingup"] = {};

    //checking if the driver has met the passenger
    // but bare in mind that the animation does not update the driver's current location to its travelling location, so this check wouldnt do much
    if (
        driver.currentLocation[0] !== driver.destination[0] &&
        driver.currentLocation[1] !== driver.destination[1]
      ) {
        console.log("it works!!!");
      }

    // might not be necessary
    // console.log(driver.currentLocation, "driver current location");
    // console.log(driver.destination, "driver destination");

    // same check as above, just top one is negation, this one is equation
    console.log(driver.currentLocation === driver.destination, "pls be true");
    // this is just force asserting that the driver has reached the passenger
    driver.currentLocation = driver.destination;
    driver.pickUp(); //assigned the next state "transit" state to driver, announce in console

    //populating the fresh log entry
    driver.Log[driver.completedJobs]["pickingup"]["duration"] =
      finishTime - initialTime;
    driver.Log[driver.completedJobs]["pickingup"]["distance"] =
      pickupDistance;
    driver.Log[driver.completedJobs]["pickingup"]["fuel cost"] =
      getFuelCost(pickupDistance);

    //console log the driver's log entry
    console.log(driver.id, driver.Log, "Pick Up Log");

    //preparing to move to the next state
    if (driver.state === "transit" && isRunning === true) {
      // driver.totalTicks = startDateTicks;
      console.log("driver", driver.id, "is now in transit");
      handleTransit(driver);
    }

    // setTimeout(() => {
      // while (
      //   driver.currentLocation[0] !== driver.destination[0] &&
      //   driver.currentLocation[1] !== driver.destination[1]
      // ) {
      //   console.log(driver.currentLocation, "driver current location");
      //   console.log(driver.destination, "driver destination");
      //   console.log("it failed so here i am ");

      //   // break;
      // }
      
      // console.log("wait here");
      // console.log(driver.currentLocation === driver.destination, "pls be true");
      // if (driver.currentLocation === driver.destination) {
      // console.log("CHECK PASSED");
      // let whilepickupcheckcounter = 0
      // while (
      //   driver.currentLocation[0].toFixed(4) !==
      //     driver.destination[0].toFixed(4) &&
      //   driver.currentLocation[1].toFixed(4) !==
      //     driver.destination[1].toFixed(4)
      // ) {
      //   //Do nothing, just keep checking
      //   // console.log("checking");
      //   whilepickupcheckcounter++;
      //   console.log("while pickup, check number of times current location and destination don't match: ", whilepickupcheckcounter);
      //   break;
      // }
      // }
    // }, 3000);
  }

  function handleTransit(driver) {
    //start time
    const initialTime = driver.timeCounter;
    
    //affecting the driver object
    // this builds the path from the driver's picked up location with the passenger to the passenger's destination
    driver.path = buildPath(driver.currentLocation, driver.destination);
    const distance = getDistance(driver.path);
    const estTimeMin = esttimeTaken(distance, driver.speed);
    driver.currentSteps = timeToSteps(estTimeMin, driver);
    
    //the actual animation call to move the driver to the transit location
    // the only animation line to move from picked up place to carrying passenger's destination
    aLongJourney(driver);

    driver.distancePerStep = distanceperStep(
      driver.speed,
      driver.currentSteps,
      distance,
      driver
    );

    driverPaths.features[driver.id - 1] = driver.path;
    map.getSource("routes").setData(driverPaths);
    driver.counter = 0;

    // ---------now transit is complete, bottom is largely logging of picking up activity---------
    //initialising variables
    const finishTime = driver.timeCounter;
    const transitDistance = getDistance(driver.path);

    //updating the fresh log entry for this driver with transit segment
    driver.Log[driver.completedJobs]["transit"] = {};

    //populating the fresh log entry
    driver.Log[driver.completedJobs]["transit"]["duration"] =
      finishTime - initialTime;
    driver.Log[driver.completedJobs]["transit"]["distance"] = 
      transitDistance;
    driver.Log[driver.completedJobs]["transit"]["fuel cost"] =
      getFuelCost(transitDistance);

    //console log the driver's log entry
    console.log("Transit Log for driver", driver.id, driver.Log);

    //preparing to move to the next state
    if (driver.state === "completed" && driver.passenger != null
    // isRunning === true
    ) {
      console.log("driver", driver.id, "has completed a job");
      handleComplete(driver);
    }

    // animatedriver(driver);
    // animatepassenger(driver);

    // setTimeout(() => {
      //need to debug passenger exit
      
      // const fare = god.fareCalculation(transitDistance, )
      //  const profit = god.profitCalculation(fare, fuel)
      
      // driver.completed();
      
      // handleSearch(driver);
    // }, 3000);

  }

  function handleComplete(driver) {
    //SPECIAL: this is after transit animation has completed, so we can remove the passenger from the map, essentially doing handleComplete()
    for (let i = 0; i < passengerPoints.features.length; i++) {
        if (passengerPoints.features[i].properties.id === driver.passenger.id) {
          console.log("before removal, remaining passengers: ", passengerPoints.features.length);
          const victimSoul = passengers.splice(i, 1);
          console.log("passenger " + victimSoul[0].id + " removed from computation");
          const victimFace = passengerPoints.features.splice(i, 1);
          console.log("passenger " + victimFace[0].properties.id + " removed from map");
          console.log("after removal, remaining passengers: ", passengerPoints.features.length);
          console.log("passenger points (list of psng noted on map): ", passengerPoints.features);
          console.log("passenger list (list of psng in computation): ", passengers);
          map.getSource("passengers").setData(passengerPoints);
        }
      }
    driver.completed(); //assigned the next state "complete" state to driver, announce in console

    //preparing to move to the next state
    if (driver.state === "searching" && isRunning === true) {
      // driver.totalTicks = startDateTicks;
      console.log("driver", driver.id, "is now searching");
      handleSearch(driver);
    }
  }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);

          //show all driverpaths
          map.addSource("routes", {
            type: "geojson",
            data: driverPaths,
          });
          //driver
          // map.addSource("driverpoint", {
          //   type: "geojson",
          //   data: driverpoint,
          // });

          map.addLayer({
            id: "routes",
            source: "routes",
            type: "line",
            paint: {
              "line-width": 4,
              "line-color": "#F1295B",
            },
          });

          //show all driver current locations
          map.addSource("drivers", {
            type: "geojson",
            data: driverPoints,
          });
          map.addLayer({
            id: "drivers",
            source: "drivers",
            type: "symbol",
            layout: {
              // This icon is a part of the Mapbox Streets style.
              // To view all images available in a Mapbox style, open
              // the style in Mapbox Studio and click the "Images" tab.
              // To add a new image to the style at runtime see
              // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
              "icon-image": "custom-marker",
              "icon-size": 0.5,
              "icon-rotate": ["get", "bearing"],
              "icon-rotation-alignment": "map",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
          });

          //show all passengers current location
          map.addSource("passengers", {
            type: "geojson",
            data: passengerPoints,
          });

          map.loadImage(
            "https://docs.mapbox.com/mapbox-gl-js/assets/cat.png",
            (error, image) => {
              if (error) throw error;

              // Add the image to the map style.
              map.addImage("cat", image);
            }
          );
          map.addLayer({
            id: "passengers",
            source: "passengers",
            type: "symbol",
            layout: {
              // This icon is a part of the Mapbox Streets style.
              // To view all images available in a Mapbox style, open
              // the style in Mapbox Studio and click the "Images" tab.
              // To add a new image to the style at runtime see
              // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
              "icon-image": "cat",
              "icon-size": 0.08,
              "icon-rotate": ["get", "bearing"],
              "icon-rotation-alignment": "map",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
          });
        }
      );
      setMap(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <>
      <div>
        <div className="map-container" ref={mapContainer} />
        <Button onClick={startDriver}> Debug start driver</Button>
        <Button onClick={stopDriver}> Debug stop driver </Button>
        {/* <Center> */}
        <Button onClick={continueDriver}> Debug continue driver</Button>
        {/* </Center> */}

        <Button onClick={spawnPassenger}>Spawn Passenger</Button>
        <Button onClick={startAnimation}>Start Animation</Button>
        <Button onClick={stopAnimation}>Stop Animation</Button>
        <Button onClick={continueAnimation}>Continue Animation</Button>
        <div> No. of drivers : {drivers.length}</div>
        <div> No. of passengers : {passengers.length}</div>
      </div>
    </>
  );
}
