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
    let Pos =
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

  let passenger1 = new Passenger({
    id: 1,
    ref: null,
    destination: generateRandomCoord(),
    currentLocation: generateRandomCoord(),
  });

  let passenger2 = new Passenger({
    id: 2,
    ref: null,
    destination: generateRandomCoord(),
    currentLocation: generateRandomCoord(),
  });

  let passenger3 = new Passenger({
    id: 3,
    ref: null,
    destination: generateRandomCoord(),
    currentLocation: generateRandomCoord(),
  });

  let passenger4 = new Passenger({
    id: 3,
    ref: null,
    destination: generateRandomCoord(),
    currentLocation: generateRandomCoord(),
  });

  let passenger5 = new Passenger({
    id: 3,
    ref: null,
    destination: generateRandomCoord(),
    currentLocation: generateRandomCoord(),
  });
  let passenger6 = new Passenger({
    id: 3,
    ref: null,
    destination: generateRandomCoord(),
    currentLocation: generateRandomCoord(),
  });
  let running = false;

  const [drivers, setDrivers] = useState([driver1, driver2, driver3]);

  const [passengers, setPassengers] = useState([
    passenger1,
    passenger2,
    passenger3,
    passenger4,
    passenger5,
    passenger6,
  ]);

  // console.log(passengers);

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

  function animatedriver(driver) {
    console.log(driver.currentSteps, "steps in animate");
    if (driver.timeCounter === 0) {
      console.log("start of the day");
      // console.log(driver.currentLocation, "first");
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

    driverPoints.features[driver.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[driver.counter];
    //update currentLocation is here
    driver.currentLocation = driver.path.geometry.coordinates[driver.counter];
    driverPoints.features[driver.id - 1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.getSource("drivers").setData(driverPoints);

    if (driver.counter < driver.currentSteps) {
      // requestAnimationFrame(() => animatedriver(driver, steps));
      // animationId = requestAnimationFrame(() => animatedriver(driver, steps));
      // const animationId = requestAnimationFrame(() => animatedriver(driver));
      // animationIds.push(animationId);
      const animationId = requestAnimationFrame(() => animatedriver(driver));
      animationIds[driver.id - 1].push(animationId);
    }
    console.log(driver.counter, driver.currentLocation);
    driver.counter = driver.counter + 1;
    driver.timeCounter = driver.timeCounter + 1;

    driver.timeLog[driver.timeCounter] = {};
    driver.timeLog[driver.timeCounter]["state"] = driver.state;
    driver.timeLog[driver.timeCounter]["distance travelled"] =
      driver.distancePerStep;
    driver.timeLog[driver.timeCounter]["time passed"] = 1;
    // driver.timeLog[driver.timeCounter]["leftover time"] = 0;
    driver.timeLog[driver.timeCounter]["speed"] = driver.speed;
    if (driver.counter === driver.currentSteps + 1) {
      driver.timeLog[driver.timeCounter]["distance travelled"] =
        driver.currentLeftoverDistance;
      driver.timeLog[driver.timeCounter]["time passed"] =
        driver.currentLeftoverTime;
      // driver.timeLog[driver.timeCounter]["leftover distance"] =
      //   driver.currentLeftoverDistance;
      // driver.timeLog[driver.timeCounter]["leftover time"] =
      //   driver.currentLeftoverTime;
    }

    console.log(driver.id, driver.timeLog, "time log per frame");
    if (driver.timeCounter === 1440) {
      console.log("end of the day");
      // console.log(driver.currentLocation, "first");
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
    const distance = lineDistance.toFixed(2);
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

      handleSearch(driver);
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
        animatedriver(driver);
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
    const initialTime = driver.timeCounter;
    driver.Log[driver.completedJobs] = {};
    driver.Log[driver.completedJobs]["searching"] = {};
    const initialLocation = driver.currentLocation;

    driver.counter = 0;

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

    animatedriver(driver);
    let getPassengerTime = 0;
    if (passengers.length > 0 && driver.state === "searching") {
      driver.passenger = passengers[driver.id];
      // stopAnimation();
      // console.log(driver.id, driver.passenger);
      getPassengerTime = driver.timeCounter;
      driver.Log[driver.completedJobs]["searching"]["timeFound"] =
        getPassengerTime;
      // stopDriver(driver);
      // console.log("driver stopped");
    }

    driver.search(driver.passenger);
    //may need to update
    driver.Log[driver.completedJobs]["searching"]["distance"] =
      driver.timeLog[driver.timeCounter]["distance travelled"];
    // console.log("checking");
    driver.Log[driver.completedJobs]["searching"]["fuel cost"] = getFuelCost(
      driver.timeLog[driver.timeCounter]["distance travelled"]
    );

    driver.Log[driver.completedJobs]["searching"]["duration"] =
      getPassengerTime - initialTime;
    console.log(driver.id, driver.Log, "Searching Log");
    // driver.totalTicks = startDateTicks;
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
    driverPaths.features[driver.id - 1] = driver.path;

    if (
      driver.state === "picking up" &&
      driver.passenger != null
      // isRunning === true
    ) {
      handlePickup(driver);
    }
  }

  function handlePickup(driver) {
    const initialTime = driver.timeCounter;
    driver.Log[driver.completedJobs]["pickingup"] = {};

    map.getSource("routes").setData(driverPaths);

    setTimeout(() => {
      // while (
      //   driver.currentLocation[0] !== driver.destination[0] &&
      //   driver.currentLocation[1] !== driver.destination[1]
      // ) {
      //   console.log(driver.currentLocation, "driver current location");
      //   console.log(driver.destination, "driver destination");
      //   console.log("it failed so here i am ");

      //   // break;
      // }
      if (
        driver.currentLocation[0] !== driver.destination[0] &&
        driver.currentLocation[1] !== driver.destination[1]
      ) {
        console.log("it works!!!");
      }
      console.log(driver.currentLocation, "driver current location");
      console.log(driver.destination, "driver destination");
      console.log("wait here");
      console.log(driver.currentLocation === driver.destination, "pls be true");
      // if (driver.currentLocation === driver.destination) {
      console.log("CHECK PASSED");
      driver.currentLocation = driver.destination;
      driver.pickUp();
      const finishTime = driver.timeCounter;
      driver.Log[driver.completedJobs]["pickingup"]["duration"] =
        finishTime - initialTime;
      const pickupDistance = getDistance(driver.path);
      driver.Log[driver.completedJobs]["pickingup"]["distance"] =
        pickupDistance;
      driver.Log[driver.completedJobs]["pickingup"]["fuel cost"] =
        getFuelCost(pickupDistance);
      console.log(driver.id, driver.Log, "Pick Up Log");
      if (driver.state === "transit" && isRunning === true) {
        // driver.totalTicks = startDateTicks;
        console.log("CallTransit");
        handleTransit(driver);
      }
      // }
    }, 3000);
  }

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
    driverPaths.features[driver.id - 1] = driver.path;
    map.getSource("routes").setData(driverPaths);
    driver.counter = 0;
    animatedriver(driver);
    animatepassenger(driver);

    setTimeout(() => {
      //need to debug passenger exit
      // driver.currentLocation = driver.destination;
      console.log(driver.state, "FINISHED DELIVER");
      for (let i = 0; i < passengers.length; i++) {
        const passenger = passengers[i];

        if (driver.passenger === passenger) {
          console.log("true");
          passengers.splice(i, 1);
        }
      }
      // for (let i = 0; i < passengerPoints.features.length; i++) {
      //   if (passengerPoints.features[i].properties.id === driver.passenger.id) {
      //     passengerPoints.features.splice(i, 1);
      //     map.getSource("passengers").setData(passengerPoints);
      //   }
      //   // break;
      // }
      // console.log(passengerPoints, "after remove image");
      const finishTime = driver.timeCounter;
      driver.Log[driver.completedJobs]["transit"]["duration"] =
        finishTime - initialTime;
      const transitDistance = getDistance(driver.path);
      driver.Log[driver.completedJobs]["transit"]["distance"] = transitDistance;
      driver.Log[driver.completedJobs]["transit"]["fuel cost"] =
        getFuelCost(transitDistance);
      // const fare = god.fareCalculation(transitDistance, )
      //  const profit = god.profitCalculation(fare, fuel)
      console.log(driver.id, driver.Log, "Transit Log");
      driver.completed();
      console.log(driver.destination, "before");
      driver.destination = generateRandomCoord();
      console.log(driver.destination, "after");
      driver.path = buildPath(driver.currentLocation, driver.destination);
      processPath(driver.path);
      driverPaths.features[driver.id - 1] = driver.path;
      map.getSource("routes").setData(driverPaths);
      handleSearch(driver);
    }, 3000);
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
