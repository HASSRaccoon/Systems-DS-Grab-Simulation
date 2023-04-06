// --- (1), (2) & (3): install and import ---
import React, { useEffect, useRef, useState } from "react";
// import ReactDOM  from 'react-dom';
// import sgJSON from "../data/punngol_road_line_new.json";
import sgJSON from "./../data/road-network.json";
import * as turf from "@turf/turf";
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import caricon from "../public/grabcar.png";
import { Button, Modal, Box, LoadingOverlay, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// import { Center } from "@mantine/core";
import AnimationDriver from "../agents/AnimationDriver.js";
import AnimationPassenger from "../agents/AnimationPassenger.js";
import Globals from "../agents/Globals.js";
import Sidebar from "./Sidebar.js";
import { convertLength } from "@turf/turf";
import "./Map.css";
import * as IoIcons from "react-icons/io5";
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

  function processPath(path, steps) {
    //line Distance is number like 1.512343151
    const lineDistance = turf.length(path);

    // console.log(lineDistance, "lineDistance");
    const arc = [];

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(path, i);
      arc.push(segment.geometry.coordinates);
    }
    arc.push(turf.along(path, lineDistance).geometry.coordinates);
    path.geometry.coordinates = arc;
  }
  const spawnProbability = 0.5;

  let god = new Globals();
  // console.log(god.checkPeak(new Date())); //check peak hour
  // console.log("fares",god.fareCalculation(0.5,4,new Date())); //check raining
  // console.log("profit", god.profitCalculation(70, 44.5));

  let driver1 = new AnimationDriver({
    id: 1,
    currentLocation: generateRandomCoord(),
    speed: 50,
    destination: generateRandomCoord(),
    distanceWillingToTravel: 5,
    path: null,
    ref: null,
    passenger: null,
  });

  let driver2 = new AnimationDriver({
    id: 2,
    currentLocation: generateRandomCoord(),
    speed: 70,
    destination: generateRandomCoord(),
    distanceWillingToTravel: 3,
    path: null,
    ref: null,
    passenger: null,
  });

  let driver3 = new AnimationDriver({
    id: 3,
    currentLocation: generateRandomCoord(),
    speed: 80,
    destination: generateRandomCoord(),
    distanceWillingToTravel: 6,
    path: null,
    ref: null,
    passenger: null,
  });

  let specialdriver = new AnimationDriver({
    id: 4,
    currentLocation: generateRandomCoord(),
    speed: 60,
    destination: generateRandomCoord(),
    distanceWillingToTravel: 5,
    path: null,
    ref: null,
    passenger: null,
  });

  let running = false;

  const [drivers, setDrivers] = useState([driver1, driver2, driver3]);

  let passengerListo = [];

  for (let i = 0; i < 150; i++) {
    passengerListo[i] = new AnimationPassenger({
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
    let p = new AnimationPassenger({
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

  const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(103.807);
  const [lat, setLat] = useState(1.37);
  const [zoom, setZoom] = useState(11.5);

  //default paths on init
  for (let i = 0; i < drivers.length; i++) {
    const driver = drivers[i];
    // console.log(driver.currentLocation, driver.destination, "hello");
    // driver.currentLocation = generateRandomCoord();
    // driver.destination = generateRandomCoord();
    driver.path = buildPath(driver.currentLocation, driver.destination);
  }

  specialdriver.path = buildPath(
    specialdriver.currentLocation,
    specialdriver.destination
  );

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

  let specialPoint = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: specialdriver.currentLocation,
    },
    properties: {
      id: specialdriver.id,
    },
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
  // console.log(specialdriver, "special");
  //problem at 187
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

  let specialPath = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: specialdriver.path.geometry.coordinates,
    },
    properties: {
      id: specialdriver.id,
      weight: specialdriver.path.properties.weight,
      edgeDatas: specialdriver.path.properties.edgeDatas,
    },
  };

  // console.log(drivers, "initial drivers");
  // console.log(driverPaths, "initial paths");
  // console.log(specialPath, "initial paths");

  function animatespecialdriver(driver) {
    // console.log(driver.currentSteps, "steps in animate");
    if (driver.timeCounter === 0) {
      console.log("start of the day");
      console.log("driver starting from ", driver.currentLocation);
    }

    // console.log(driver.timeLog, "hello");

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
    // if (driver.id === 4) {
    specialPoint.geometry.coordinates =
      driver.path.geometry.coordinates[driver.counter];
    // } else {
    //   driverPoints.features[driver.id - 1].geometry.coordinates =
    //     driver.path.geometry.coordinates[driver.counter];
    // }
    // driverPoints.features[driver.id - 1].geometry.coordinates =
    //   driver.path.geometry.coordinates[driver.counter];
    //update currentLocation is here
    driver.currentLocation = driver.path.geometry.coordinates[driver.counter];
    // if (driver.id === 4) {
    specialPoint.properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );
    // } else {
    //   driverPoints.features[driver.id - 1].properties.bearing = turf.bearing(
    //     turf.point(start),
    //     turf.point(end)
    //   );
    // }

    // driverPoints.features[driver.id - 1].properties.bearing = turf.bearing(
    //   turf.point(start),
    //   turf.point(end)
    // );
    // if (driver.id === 4) {
    map.getSource("me").setData(specialPoint);
    // } else {
    //   map.getSource("drivers").setData(driverPoints);
    // }
    // map.getSource("drivers").setData(driverPoints);

    if (driver.counter < driver.currentSteps) {
      // requestAnimationFrame(() => animatedriver(driver, steps));
      // animationId = requestAnimationFrame(() => animatedriver(driver, steps));
      // const animationId = requestAnimationFrame(() => animatedriver(driver));
      // animationIds.push(animationId);
      //error
      const animationId = requestAnimationFrame(() =>
        animatespecialdriver(driver)
      );
      animationIds[driver.id - 1].push(animationId);
    }
    // console.log(driver.counter, driver.currentLocation);
    driver.counter = driver.counter + 1;

    driver.timeCounter = driver.timeCounter + 1;
    // if (driver.id === 1) {
    //   setTime(time);
    // }
    driver.timeLog[driver.timeCounter] = {};
    driver.timeLog[driver.timeCounter]["state"] = driver.state;
    driver.timeLog[driver.timeCounter]["distance travelled"] =
      driver.distancePerStep;
    driver.timeLog[driver.timeCounter]["time passed"] = 1;
    driver.timeLog[driver.timeCounter]["speed"] = driver.speed;
    if (driver.counter === driver.currentSteps + 1) {
      driver.timeLog[driver.timeCounter]["distance travelled"] =
        driver.currentLeftoverDistance;
      driver.timeLog[driver.timeCounter]["time passed"] =
        driver.currentLeftoverTime;
    }

    driver.totalDistanceTravelled =
      driver.totalDistanceTravelled +
      driver.timeLog[driver.timeCounter]["distance travelled"];

    driver.totalFuelCosts =
      driver.totalFuelCosts +
      getFuelCost(driver.timeLog[driver.timeCounter]["distance travelled"]);

    // if (driver.id === 1) {
    //   setTime(driver.timeCounter);
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

  function animatedriver(driver) {
    // console.log(driver.currentSteps, "steps in animate");
    if (driver.timeCounter === 0) {
      console.log("start of the day");
      console.log("driver starting from ", driver.currentLocation);
    }

    // console.log(driver.timeLog, "hello");

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
    // if (driver.id === 4) {
    //   specialPoint.geometry.coordinates =
    //     driver.path.geometry.coordinates[driver.counter];
    // } else {

    // }
    driverPoints.features[driver.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[driver.counter];

    //update currentLocation is here
    driver.currentLocation = driver.path.geometry.coordinates[driver.counter];
    // if (driver.id === 4) {
    //   specialPoint.properties.bearing = turf.bearing(
    //     turf.point(start),
    //     turf.point(end)
    //   );
    // } else {
    //   driverPoints.features[driver.id - 1].properties.bearing = turf.bearing(
    //     turf.point(start),
    //     turf.point(end)
    //   );
    // }

    driverPoints.features[driver.id - 1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );
    // if (driver.id === 4) {
    //   map.getSource("me").setData(specialPoint);
    // } else {
    //   map.getSource("drivers").setData(driverPoints);
    // }
    map.getSource("drivers").setData(driverPoints);

    if (driver.counter < driver.currentSteps) {
      // requestAnimationFrame(() => animatedriver(driver, steps));
      // animationId = requestAnimationFrame(() => animatedriver(driver, steps));
      // const animationId = requestAnimationFrame(() => animatedriver(driver));
      // animationIds.push(animationId);
      //error
      const animationId = requestAnimationFrame(() => animatedriver(driver));
      animationIds[driver.id - 1].push(animationId);
    }
    // console.log(driver.counter, driver.currentLocation);
    driver.counter = driver.counter + 1;

    driver.timeCounter = driver.timeCounter + 1;
    // if (driver.id === 1) {
    //   setTime(time);
    // }
    driver.timeLog[driver.timeCounter] = {};
    driver.timeLog[driver.timeCounter]["state"] = driver.state;
    driver.timeLog[driver.timeCounter]["distance travelled"] =
      driver.distancePerStep;
    driver.timeLog[driver.timeCounter]["time passed"] = 1;
    driver.timeLog[driver.timeCounter]["speed"] = driver.speed;
    if (driver.counter === driver.currentSteps + 1) {
      driver.timeLog[driver.timeCounter]["distance travelled"] =
        driver.currentLeftoverDistance;
      driver.timeLog[driver.timeCounter]["time passed"] =
        driver.currentLeftoverTime;
    }

    driver.totalDistanceTravelled =
      driver.totalDistanceTravelled +
      driver.timeLog[driver.timeCounter]["distance travelled"];

    driver.totalFuelCosts =
      driver.totalFuelCosts +
      getFuelCost(driver.timeLog[driver.timeCounter]["distance travelled"]);

    // if (driver.id === 1) {
    //   setTime(driver.timeCounter);
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

  let animationIds = new Array(drivers.length + 1).fill([]);

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
    // const passenger = driver.passenger;
    //check
    // passengerPoints.features[passenger.id - 1].geometry.coordinates =
    //   driver.path.geometry.coordinates[driver.passenger.counter];
    passengerPoints.features[driver.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[driver.passenger.counter];

    // passengerPoints.features[driver.passenger.id - 1].geometry.coordinates =
    //   driver.path.geometry.coordinates[driver.passenger.counter];
    // passengerPoints.features[driver.passenger.id - 1].properties.bearing =
    // turf.bearing(turf.point(start), turf.point(end));

    // passengerPoints.features[passenger.id - 1].properties.bearing =
    //   turf.bearing(turf.point(start), turf.point(end));

    passengerPoints.features[driver.id - 1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.getSource("passengers").setData(passengerPoints);

    if (driver.passenger.counter < driver.currentSteps) {
      //error
      // requestAnimationFrame(() => animatepassenger(driver, steps));
      const animationId = requestAnimationFrame(() => animatepassenger(driver));
      animationIds.push(animationId);

      // const animationId = requestAnimationFrame(() => animatedriver(driver));
      // animationIds[driver.id - 1].push(animationId);
    }

    driver.passenger.counter = driver.passenger.counter + 1;
  }

  function animatespecialpassenger(driver) {
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
    const passenger = driver.passenger;
    passengerPoints.features[passenger.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[driver.passenger.counter];

    // passengerPoints.features[driver.passenger.id - 1].geometry.coordinates =
    //   driver.path.geometry.coordinates[driver.passenger.counter];
    // passengerPoints.features[driver.passenger.id - 1].properties.bearing =
    // turf.bearing(turf.point(start), turf.point(end));

    passengerPoints.features[passenger.id - 1].properties.bearing =
      turf.bearing(turf.point(start), turf.point(end));

    map.getSource("passengers").setData(passengerPoints);

    if (driver.passenger.counter < driver.currentSteps) {
      //error
      // requestAnimationFrame(() => animatepassenger(driver, steps));
      const animationId = requestAnimationFrame(() =>
        animatespecialpassenger(driver)
      );
      animationIds.push(animationId);

      // const animationId = requestAnimationFrame(() => animatedriver(driver));
      // animationIds[driver.id - 1].push(animationId);
    }

    driver.passenger.counter = driver.passenger.counter + 1;
  }

  function getDistance(path) {
    const lineDistance = turf.length(path);
    // const distance = lineDistance.toFixed(2); //eugene: might take out? unless better to have 2dp
    return lineDistance;
  }

  function getFares(distance, speed) {
    // const time = esttimeTaken(distance, speed);
    //time = distance/speed
  }

  function dateToTicks(date) {
    const epochOffset = 621355968000000000;
    const ticksPerMillisecond = 10000;

    const ticks = date.getTime() * ticksPerMillisecond + epochOffset;

    return ticks;
  }

  let isRunning = false;
  // const [isRunning, setisRunning] = useState(false);

  function getFuelCost(distance) {
    const rateperkm = 22.54 / 100;
    const fuelcostperdist = distance * rateperkm;
    //22.54 per 100km
    //22.54/100 per km
    return fuelcostperdist.toFixed(2);
  }

  function startAnimation() {
    isRunning = true;
    // setisRunning(true);
    console.log(isRunning, "true");
    for (let i = 0; i < drivers.length; i++) {
      let driver = drivers[i];
      driver.counter = 0;

      handleSearch(driver);
    }
    handleSearch(specialdriver);
  }

  function startDriver() {
    let driver = drivers[0];
    driver.counter = 0;
    handleSearch(driver);
  }

  function stopAnimation() {
    console.log(animationIds, "animation ids");
    animationIds.forEach((id) => cancelAnimationFrame(id));
    // setisRunning(false);
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
        // setisRunning(true);
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
    const speedpermin = speed / 60;

    const leftoverdistance = distance - speedpermin * (steps - 1);

    driver.currentLeftoverDistance = leftoverdistance;

    return speedpermin;
  }

  function esttimeTaken(distance, speed) {
    const estimatedTimeMin = (distance / speed) * 60;

    return estimatedTimeMin;
    //time = distance/speed
  }

  function assignPassenger(driver) {
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      const path = buildPath(passenger.currentLocation, driver.currentLocation);
      const distance = getDistance(path);

      if (
        driver.distanceWillingToTravel > distance &&
        //maybe this
        passenger.driver === null
        // driver.passenger === null
      ) {
        driver.passenger = passenger;
        passenger.driver = driver;
        console.log(driver.passenger, "passenger assigned");
        break;
      }
    }
  }

  //maybe check these

  // useEffect(() => {
  //   const currentTime = drivers[0].timeCounter;
  //   setTime(currentTime);
  //   const driver = drivers[0];
  //   console.log("THIS CAN PRINT");
  //   console.log(time, "what time now");
  //   console.log(drivers[0].timeLog, "log");
  // }, [drivers]);
  let timelist = [];
  let statelist = [];
  let speedlist = [];
  let jobsdonelist = [];
  let profitlist = [];
  let distancelist = [];
  let avgjobsdonelist = [];
  let avgprofitlist = [];
  let avgdistancelist = [];

  //damn manual but nvm first

  function updateStats() {
    setInterval(() => {
      console.log(specialdriver.timeCounter, "timecounter");
      timelist[0] = specialdriver.timeCounter;
      statelist[0] = specialdriver.state;
      speedlist[0] = specialdriver.speed;
      jobsdonelist[0] = specialdriver.completedJobs;
      const yourfuelcost = getFuelCost(
        specialdriver.totalDistanceTravelled.toFixed(3)
      );
      const yourprofit = specialdriver.earnings - yourfuelcost;
      profitlist[0] = yourprofit.toFixed(2);
      distancelist[0] = specialdriver.totalDistanceTravelled.toFixed(3);

      const avgjobsdone =
        (drivers[0].completedJobsdrivers +
          drivers[1].completedJobs +
          drivers[2].completedJobs) /
        3;
      avgjobsdonelist[0] = avgjobsdone.toFixed(1);

      const d1fuelcost = getFuelCost(
        drivers[0].totalDistanceTravelled.toFixed(3)
      );
      const d2fuelcost = getFuelCost(
        drivers[1].totalDistanceTravelled.toFixed(3)
      );
      const d3fuelcost = getFuelCost(
        drivers[2].totalDistanceTravelled.toFixed(3)
      );
      const d1profit = drivers[0].earnings - d1fuelcost;
      const d2profit = drivers[1].earnings - d2fuelcost;
      const d3profit = drivers[2].earnings - d3fuelcost;
      const avgprofit = (d1profit + d2profit + d3profit) / 3;
      const avgdistance =
        (drivers[0].totalDistanceTravelled +
          drivers[1].totalDistanceTravelled +
          drivers[2].totalDistanceTravelled) /
        3;
      avgprofitlist[0] = avgprofit.toFixed(2);
      avgdistancelist[0] = avgdistance.toFixed(3);

      // const currentTime = drivers[0].timeCounter;
      // setTime(currentTime);
      // console.log(time, "update time");
      // setState(drivers[0].state);
      // setjobsDone(drivers[0].completedJobs);
    }, 1000);
  }

  updateStats();

  //without peak/nonpeak yet
  //without fuelcost
  function earningCalculation(distance, timetaken) {
    const earning = (3.5 + 0.5 * distance + 0.16 * timetaken) * 0.8;
    return earning.toFixed(2);
  }

  function handleSearch(driver) {
    const initialTime = driver.timeCounter;
    driver.Log[driver.completedJobs] = {};
    driver.Log[driver.completedJobs]["searching"] = {};
    // const initialLocation = driver.currentLocation;
    const initialDistance = getDistance(driver.path);
    const estTimeMin = esttimeTaken(initialDistance, driver.speed);
    driver.currentSteps = timeToSteps(estTimeMin, driver);
    processPath(driver.path, driver.currentSteps);
    driver.distancePerStep = distanceperStep(
      driver.speed,
      driver.currentSteps,
      initialDistance,
      driver
    );
    driver.counter = 0;

    if (driver.id === 4) {
      animatespecialdriver(driver);
    } else {
      animatedriver(driver);
    }

    let getPassengerTime = 0;
    //if still have passengers on map and searching
    if (passengers.length > 0 && driver.state === "searching") {
      //if passenger no driver, and dis to passenger < willingness to travel
      assignPassenger(driver);

      console.log(driver.id, driver.passenger, "found");
      getPassengerTime = driver.timeCounter;
      driver.Log[driver.completedJobs]["searching"]["timeFound"] =
        getPassengerTime;
    }
    driver.search(driver.passenger);
    //may need to update

    driver.Log[driver.completedJobs]["searching"]["distance"] =
      driver.timeLog[driver.timeCounter]["distance travelled"];
    driver.Log[driver.completedJobs]["searching"]["fuel cost"] = getFuelCost(
      driver.timeLog[driver.timeCounter]["distance travelled"]
    );
    driver.Log[driver.completedJobs]["searching"]["duration"] =
      getPassengerTime - initialTime;

    // driver.totalDistanceTravelled =
    //   driver.totalDistanceTravelled +
    //   driver.timeLog[driver.timeCounter]["distance travelled"];

    console.log(driver.id, driver.Log, "Searching Log");

    //have new dest, so build new path there
    driver.path = buildPath(driver.currentLocation, driver.destination);
    const newdistance = getDistance(driver.path);
    const newestTimeMin = esttimeTaken(newdistance, driver.speed);
    driver.currentSteps = timeToSteps(newestTimeMin, driver);
    processPath(driver.path, driver.currentSteps);
    driver.distancePerStep = distanceperStep(
      driver.speed,
      driver.currentSteps,
      newdistance,
      driver
    );
    if (driver.id === 4) {
      specialPath = driver.path;
    } else {
      driverPaths.features[driver.id - 1] = driver.path;
    }
    // driverPaths.features[driver.id - 1] = driver.path;

    if (driver.state === "picking up" && driver.passenger != null) {
      handlePickup(driver);
    }
  }

  function handlePickup(driver) {
    const initialTime = driver.timeCounter;
    driver.Log[driver.completedJobs]["pickingup"] = {};
    if (driver.id === 4) {
      map.getSource("myroute").setData(specialPath);
      // console.log(specialPath)
    } else {
      map.getSource("routes").setData(driverPaths);
    }
    // map.getSource("routes").setData(driverPaths);

    setTimeout(() => {
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
      console.log(
        driver.currentLocation,
        driver.destination,
        "driver not arrive"
      );
      driver.currentLocation = driver.destination;
      console.log(
        driver.currentLocation,
        driver.destination,
        " make driver arrive"
      );
      driver.pickUp();
      console.log(
        driver.currentLocation,
        driver.destination,
        "driver new dest"
      );
      const finishTime = driver.timeCounter;
      driver.Log[driver.completedJobs]["pickingup"]["duration"] =
        finishTime - initialTime;
      const pickupDistance = getDistance(driver.path);
      driver.Log[driver.completedJobs]["pickingup"]["distance"] =
        pickupDistance;
      // driver.totalDistanceTravelled =
      //   driver.totalDistanceTravelled + pickupDistance;
      driver.Log[driver.completedJobs]["pickingup"]["fuel cost"] =
        getFuelCost(pickupDistance);
      console.log(driver.id, driver.Log, "Pick Up Log");
      if (driver.state === "transit" && isRunning === true) {
        // driver.totalTicks = startDateTicks;
        console.log("Call Transit");
        handleTransit(driver);
      }
      // }
    }, 3000);
  }
  // function handleFFW() {

  // }

  function handleTransit(driver) {
    const initialTime = driver.timeCounter;
    driver.Log[driver.completedJobs]["transit"] = {};
    driver.path = buildPath(driver.currentLocation, driver.destination);
    const distance = getDistance(driver.path);
    const estTimeMin = esttimeTaken(distance, driver.speed);
    driver.currentSteps = timeToSteps(estTimeMin, driver);
    processPath(driver.path, driver.currentSteps);
    driver.distancePerStep = distanceperStep(
      driver.speed,
      driver.currentSteps,
      distance,
      driver
    );

    if (driver.id === 4) {
      specialPath = driver.path;
    } else {
      driverPaths.features[driver.id - 1] = driver.path;
    }
    // driverPaths.features[driver.id - 1] = driver.path;
    // console.log(driverPaths, "why cannot getsource");
    if (driver.id === 4) {
      map.getSource("myroute").setData(specialPath);
    } else {
      map.getSource("routes").setData(driverPaths);
    }
    // map.getSource("routes").setData(driverPaths);
    driver.counter = 0;
    driver.passenger.counter = 0;
    if (driver.id === 4) {
      animatespecialdriver(driver);
      animatespecialpassenger(driver);
    } else {
      animatedriver(driver);
      animatepassenger(driver);
    }
    // animatedriver(driver);
    // animatepassenger(driver);

    setTimeout(() => {
      //need to debug passenger exit
      // console.log(driver.id, driver.passenger);
      // console.log(passengers.length, "before remove passenger");
      // for (let i = 0; i < passengers.length; i++) {
      //   if (driver.passenger === passengers[i]) {
      //     console.log("check 1 passed");
      //     const passenger = passengers[i];
      //     const id = passenger.id;
      //     console.log(id, "id to search for");
      //     console.log(passengerPoints);
      //     for (let k = 0; k < passengerPoints.features.length; i++) {
      //       if (passengerPoints.features[k].properties.id === id) {
      //         console.log("check 2 passed");
      //         passengerPoints.features.splice(k, 1);
      //         console.log(passengerPoints, "check correct passenger image");
      //         map.getSource("passengers").setData(passengerPoints);
      //       }
      //       break;
      //     }
      //     const newpassengers = passengers.splice(i, 1);
      //     setPassengers(newpassengers);
      //   }
      // }
      // console.log(passengers.length, "passengers after remove passenger");
      // console.log(
      //   passengerPoints.length,
      //   "PassengerPoints after remove passenger"
      // );

      for (let i = 0; i < passengerPoints.features.length; i++) {
        if (passengerPoints.features[i].properties.id === driver.passenger.id) {
          console.log(
            "before removal, remaining passengers: ",
            passengerPoints.features.length
          );
          const victimSoul = passengers.splice(i, 1); //remove passenger from computation first? but this is still in transit?
          console.log(
            "passenger " + victimSoul[0].id + " removed from computation"
          );
          const victimFace = passengerPoints.features.splice(i, 1); //remove passenger from map first? but this is still in transit?
          console.log(
            "passenger " + victimFace[0].properties.id + " removed from map"
          );
          console.log(
            "after removal, remaining passengers: ",
            passengerPoints.features.length
          );
          console.log(
            "passenger points (list of psng noted on map): ",
            passengerPoints.features
          );
          console.log(
            "passenger list (list of psng in computation): ",
            passengers
          );
          map.getSource("passengers").setData(passengerPoints);
          // console.log("how many times have i been looped through? ", i);
        }
        break;
        // break;
      }

      const finishTime = driver.timeCounter;
      driver.Log[driver.completedJobs]["transit"]["duration"] =
        finishTime - initialTime;
      const transitDistance = getDistance(driver.path);
      driver.Log[driver.completedJobs]["transit"]["distance"] = transitDistance;
      driver.Log[driver.completedJobs]["transit"]["fuel cost"] =
        getFuelCost(transitDistance);

      const earning = earningCalculation(transitDistance, estTimeMin);
      driver.Log[driver.completedJobs]["transit"]["earning"] = earning;
      driver.earnings = driver.earnings + earning;

      // const fare = god.fareCalculation(transitDistance, )
      //  const profit = god.profitCalculation(fare, fuel)
      console.log("Transit Log", driver.id, driver.Log);
      driver.completed();
      console.log(driver.currentLocation, "current loc");
      console.log(driver.destination, "before");
      driver.destination = generateRandomCoord();
      // driver.destination = generateRandomCoord();
      console.log(driver.destination, "after");
      driver.path = buildPath(driver.currentLocation, driver.destination);
      //error
      processPath(driver.path);
      if (driver.id === 4) {
        specialPath = driver.path;
        map.getSource("myroute").setData(specialPath);
      } else {
        driverPaths.features[driver.id - 1] = driver.path;
        map.getSource("routes").setData(driverPaths);
      }

      // driverPaths.features[driver.id - 1] = driver.path;
      // map.getSource("routes").setData(driverPaths);
      handleSearch(driver);
    }, 3000);
  }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      // style: "mapbox://styles/mapbox/streets-v11",
      style: "mapbox://styles/mapbox/navigation-guidance-night-v3",
      center: [lng, lat],
      zoom: zoom,
    });

    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(
        // "https://freesvg.org/img/165649513901300-transport-car-sedan-green.png",
        // "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Eo_circle_green_blank.svg/2048px-Eo_circle_green_blank.svg.png",
        // "https://docs.mapbox.com/mapbox-gl-js/assets/car-15.png",
        // "mapbox://sprites/mapbox/streets-v11?access_token=pk.eyJ1IjoieWVva2V3ZWkiLCJhIjoiY2xlcG5wZ3ZmMGUweTNxdGt4ZG1ldGhsYyJ9.HHNGnKUPolWAo5_UYwzCZg",
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
              // "line-color": "#F1295B",
              // "line-color": "#00FF00",
              "line-color": "#449e48",
            },
          });

          map.addSource("myroute", {
            type: "geojson",
            data: specialPath,
          });
          //driver
          // map.addSource("driverpoint", {
          //   type: "geojson",
          //   data: driverpoint,
          // });

          map.addLayer({
            id: "myroute",
            source: "myroute",
            type: "line",
            paint: {
              "line-width": 4,
              // "line-color": "#FFFFFF",
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
              "icon-size": 0.02,
              "icon-rotate": ["get", "bearing"],
              "icon-rotation-alignment": "map",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
          });

          map.loadImage(
            // "https://docs.mapbox.com/mapbox-gl-js/assets/cat.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Red_Circle%28small%29.svg/2048px-Red_Circle%28small%29.svg.png",
            // "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Light_Blue_Circle.svg/768px-Light_Blue_Circle.svg.png",
            (error, image) => {
              if (error) throw error;

              // Add the image to the map style.
              map.addImage("special", image);
            }
          );
          map.addSource("me", {
            type: "geojson",
            data: specialPoint,
          });
          map.addLayer({
            id: "me",
            source: "me",
            type: "symbol",
            layout: {
              "icon-image": "special",
              "icon-size": 0.02,
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
            // "https://docs.mapbox.com/mapbox-gl-js/assets/cat.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Light_Blue_Circle.svg/768px-Light_Blue_Circle.svg.png",
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
              "icon-size": 0.02,
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

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Center>
        <Modal opened={opened} onClose={close}>
          <Center>
            <div className="modal-header">
              Would You Like to Fast Forward And Compile Data for 0.5 Days?
            </div>
          </Center>
          <Center>
            <div className="modal-text">
              Compiling data will take a few seconds.
            </div>
          </Center>
          <div className="modal-button">
            <Link to="/fastforward">
              <Button color="cyan" size="lg" onClick={stopAnimation}>
                <IoIcons.IoCheckmarkOutline />
                <span></span>
              </Button>
            </Link>
          </div>
        </Modal>
      </Center>

      <div className="map-container" ref={mapContainer} />
      <div>
        {/* <div className="map-container" ref={mapContainer} /> */}
        <div className="topbar">
          <IoIcons.IoCarSportOutline className="topbar-icon" />
          <h1>Simulation</h1>
        </div>

        <div className="simulation-container">
          <div className="map-container" ref={mapContainer} />
          <div className="simulation-controls">
            <div className="small-space-right"></div>
            <Button color="cyan" size="lg" onClick={startAnimation}>
              <IoIcons.IoPlayOutline />
              <span></span>
            </Button>

            <div className="small-space-right"></div>
            <Button color="cyan" size="lg" onClick={stopAnimation}>
              <IoIcons.IoPauseOutline />
              <span></span>
            </Button>
            <div className="small-space-right"></div>

            <Button color="cyan" size="lg" onClick={open}>
              <IoIcons.IoPlayForwardOutline /> <span></span>
            </Button>
          </div>
        </div>
      </div>
      {/* <Button onClick={spawnPassenger}>Spawn Passenger</Button> */}
      {/* <Button onClick={startAnimation}>Start Animation</Button>
      <Button onClick={stopAnimation}>Stop Animation</Button> */}
      {/* <Button onClick={continueAnimation}>Continue Animation</Button> */}
      {/* <Link to="/fastforward">
        <Button>Fast Forward</Button>
      </Link> */}
      {/* 
      <div> No. of drivers : {drivers.length}</div>
      <div> No. of passengers : {passengers.length}</div>
      <div>Check Time Update: {time}</div>
      <div> Check State Update: {state} </div> */}
      <Sidebar
        // driver={drivers[0]}

        // time={time}
        // time={time}
        timelist={timelist}
        statelist={statelist}
        speedlist={speedlist}
        jobsdonelist={jobsdonelist}
        profitlist={profitlist}
        distancelist={distancelist}
        avgdistancelist={avgdistancelist}
        avgprofitlist={avgprofitlist}
        avgjobsdonelist={avgjobsdonelist}
      ></Sidebar>
    </>
  );
}
