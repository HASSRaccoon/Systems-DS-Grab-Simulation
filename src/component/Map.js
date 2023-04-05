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
import AnimationDriver from "../agents/AnimationDriver.js";
import AnimationPassenger from "../agents/AnimationPassenger.js";
import Globals from "../agents/Globals.js";
import Sidebar from "./Sidebar.js";
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
    distanceWillingToTravel: 10,
    path: null,
    ref: null,
  });

  let driver2 = new AnimationDriver({
    id: 2,
    currentLocation: generateRandomCoord(),
    speed: 70,
    destination: generateRandomCoord(),
    distanceWillingToTravel: 10,
    path: null,
    ref: null,
  });

  let driver3 = new AnimationDriver({
    id: 3,
    currentLocation: generateRandomCoord(),
    speed: 80,
    destination: generateRandomCoord(),
    distanceWillingToTravel: 10,
    path: null,
    ref: null,
  });

  let running = false;

  const [drivers, setDrivers] = useState([driver1, driver2, driver3]);

  let passengerListo = [];

  for (let i = 0; i < 20; i++) {
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
    // console.log(driver.currentLocation, driver.destination, "hello");
    // driver.currentLocation = generateRandomCoord();
    driver.destination = generateRandomCoord();
    driver.path = buildPath(driver.currentLocation, driver.destination);
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
    driver.timeLog[driver.timeCounter]["speed"] = driver.speed;
    if (driver.counter === driver.currentSteps + 1) {
      driver.timeLog[driver.timeCounter]["distance travelled"] =
        driver.currentLeftoverDistance;
      driver.timeLog[driver.timeCounter]["time passed"] =
        driver.currentLeftoverTime;
    }
    // if (driver.id === 1) {
    //   setTime(driver.timeCounter);
    // }
    console.log(driver.id, driver.timeLog, "time log per frame");
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
    return fuelcostperdist;
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

  function assignPassenger(driver) {
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      // console.log(passenger);
      const path = buildPath(passenger.currentLocation, driver.currentLocation);
      const distance = getDistance(path);
      console.log(passenger.id, distance);
      console.log(driver);
      console.log(driver.distanceWillingToTravel, "willing distance");
      if (driver.distanceWillingToTravel > distance) {
        driver.passenger = passenger;
        console.log(driver.passenger, "passenger assigned 1");
        break;
      }
    }
  }
  // console.log(drivers[0].passenger, "before");
  // assignPassenger(drivers[0]);
  // console.log(drivers[0].passenger, "after");

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
      assignPassenger(driver);
      console.log(driver.passenger, "passenger assigned 2");

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
    console.log(driver.id, driver.Log, "Searching Log");
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

    if (driver.state === "picking up" && driver.passenger != null) {
      handlePickup(driver);
    }
  }

  function handlePickup(driver) {
    const initialTime = driver.timeCounter;
    driver.Log[driver.completedJobs]["pickingup"] = {};

    map.getSource("routes").setData(driverPaths);

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

  const [time, setTime] = useState(0);
  const [profit, setProfit] = useState(0);
  const [jobsDone, setjobsDone] = useState(0);

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
    driver.passenger.counter = 0;
    animatedriver(driver);
    animatepassenger(driver);

    setTimeout(() => {
      //need to debug passenger exit

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
        // break;
      }

      const finishTime = driver.timeCounter;
      driver.Log[driver.completedJobs]["transit"]["duration"] =
        finishTime - initialTime;
      const transitDistance = getDistance(driver.path);
      driver.Log[driver.completedJobs]["transit"]["distance"] = transitDistance;
      driver.Log[driver.completedJobs]["transit"]["fuel cost"] =
        getFuelCost(transitDistance);
      // const fare = god.fareCalculation(transitDistance, )
      //  const profit = god.profitCalculation(fare, fuel)
      console.log("Transit Log for driver", driver.id, driver.Log);
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
    //   driver.destination = generateRandomCoord(); // currentlocation was set to prior destination that driver finished servicing passenger, but how come with new random destination set it is not driving into the random coord? check bottom
    //   driver.path = buildPath(driver.currentLocation, driver.destination); // new path draw from prior passenger destination to new random destination
    //   processPath(driver.path);
    //   driverPaths.features[driver.id - 1] = driver.path;
    //   map.getSource("routes").setData(driverPaths);
    //   handleSearch(driver); //earlier set path for new search direction
    // }, 8000);
  }
  useEffect(() => {
    const currentTime = drivers[0].timeCounter;
    setTime(currentTime);
  }, [drivers[0].timeCounter]);

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
        // "https://freesvg.org/img/165649513901300-transport-car-sedan-green.png",
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
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
        <Sidebar
          driver={drivers[0]}
          Log={drivers[0].Log}
          timeLog={drivers[0].timeLog}
          isRunning={isRunning}
          time={drivers[0].timeCounter}
          setTime={setTime}
          jobsDone={jobsDone}
          setjobsDone={setjobsDone}
        ></Sidebar>
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
        <div>Checking: {drivers[0].timeCounter}</div>
      </div>
    </>
  );
}
