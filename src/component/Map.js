// --- (1), (2) & (3): install and import ---
import React, { useEffect, useRef, useState } from "react";
// import ReactDOM  from 'react-dom';
import sgJSON from "../data/punngol_road_line_new.json";
// import sgJSON from "./../data/road-network.json";
import * as turf from "@turf/turf";
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import mapboxgl from "mapbox-gl";
import caricon from "../public/grabcar.png";
import { Button } from "@mantine/core";
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
    speed: 60,
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

  let running = false;

  const [drivers, setDrivers] = useState([driver1, driver2]);

  const [passengers, setPassengers] = useState([
    passenger1,
    passenger2,
    passenger3,
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
    map.getSource("passengers").setData(passengerPoints);
    console.log(passengers);
  }

  const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(103.908009);
  const [lat, setLat] = useState(1.406741);
  const [zoom, setZoom] = useState(14);

  //default paths on init
  for (let i = 0; i < drivers.length; i++) {
    const driver = drivers[i];
    // console.log(driver.id);
    driver.path = buildPath(driver.currentLocation, driver.destination);
    const steps = (100 - driver.speed) * 5;
    //replace steps with speed next time
    processPath(driver.path, steps);
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

  function animatedriver(driver, steps) {
    // console.log(driver);
    if (driver.counter === 0) {
      console.log(driver.currentLocation, "first");
    }
    const start =
      driver.path.geometry.coordinates[
        driver.counter >= steps ? driver.counter - 1 : driver.counter
      ];
    const end =
      driver.path.geometry.coordinates[
        driver.counter >= steps ? driver.counter : driver.counter + 1
      ];

    if (!start || !end) {
      running = false;
      return;
    }

    driverPoints.features[driver.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[driver.counter];
    driver.currentLocation = driver.path.geometry.coordinates[driver.counter];
    driverPoints.features[driver.id - 1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.getSource("drivers").setData(driverPoints);

    if (driver.counter < steps) {
      // requestAnimationFrame(() => animatedriver(driver, steps));
      // animationId = requestAnimationFrame(() => animatedriver(driver, steps));
      const animationId = requestAnimationFrame(() =>
        animatedriver(driver, steps)
      );
      animationIds.push(animationId);
    }

    driver.counter = driver.counter + 1;
    if (driver.counter === steps) {
      console.log(driver.currentLocation, "last");
    }
    // console.log(driver.currentLocation, driver.counter);
  }

  let animationIds = [];
  function animatepassenger(driver, steps) {
    const start =
      driver.path.geometry.coordinates[
        driver.passenger.counter >= steps
          ? driver.passenger.counter - 1
          : driver.passenger.counter
      ];
    const end =
      driver.path.geometry.coordinates[
        driver.passenger.counter >= steps
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

    if (driver.passenger.counter < steps) {
      // requestAnimationFrame(() => animatepassenger(driver, steps));
      const animationId = requestAnimationFrame(() =>
        animatepassenger(driver, steps)
      );
      animationIds.push(animationId);
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
  // function esttimeTaken(distance, speed) {
  //   const estimatedTimeMin = (distance / speed) * 60;
  //   console.log(estimatedTimeMin);
  //   return;
  //   //time = distance/speed
  // }

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
      handleSearch(driver);
    }
  }

  function stopAnimation() {
    animationIds.forEach((id) => cancelAnimationFrame(id));
    isRunning = false;
  }

  function continueAnimation() {
    if (isRunning === false) {
      for (let i = 0; i < drivers.length; i++) {
        let driver = drivers[i];
        const steps = (100 - driver.speed) * 5;
        animatedriver(driver, steps);
      }
    }
  }

  function handleSearch(driver) {
    driver.Log[driver.completedJobs] = {};
    driver.Log[driver.completedJobs]["searching"] = {};
    const initialLocation = driver.currentLocation;
    // console.log(initialLocation, "initial location");
    const startDate = new Date();
    const startDateTicks = dateToTicks(startDate);
    driver.counter = 0;
    const steps = (100 - driver.speed) * 5;
    animatedriver(driver, steps);
    if (passengers.length > 0 && driver.state === "searching") {
      driver.passenger = passengers[driver.id];
      console.log(driver.id, driver.passenger);
      const foundDate = new Date();
      const foundDateTicks = dateToTicks(foundDate);
      driver.Log[driver.completedJobs]["searching"]["timeFound"] =
        foundDateTicks - startDateTicks;
    }

    driver.search(driver.passenger);

    let searchDistance = 0;

    // console.log(initialLocation, "initial location");
    // console.log(driver.currentLocation, "currentlocation");
    // console.log(initialLocation === driver.currentLocation, "true?");

    // if (
    //   initialLocation[0].toFixed(7) === driver.destination[0].toFixed(7) &&
    //   initialLocation[1].toFixed(7) === driver.destination[1].toFixed(7)
    // ) {
    //   searchDistance = 0;
    //   console.log("did not travel for searching");
    // } else {
    //   const searchDistPath = buildPath(
    //     initialLocation,
    //     driver.currentLocation
    //   );
    //   searchDistance = getDistance(searchDistPath);
    // }
    driver.Log[driver.completedJobs]["searching"]["distance"] = searchDistance;
    driver.Log[driver.completedJobs]["searching"]["fuel cost"] =
      getFuelCost(searchDistance);
    const endDate = new Date();
    const endDateTicks = dateToTicks(endDate);
    driver.Log[driver.completedJobs]["searching"]["duration"] =
      endDateTicks - startDateTicks;
    console.log(driver.id, driver.Log, "Searching Log");
    // driver.totalTicks = startDateTicks;
    if (
      driver.state === "picking up" &&
      driver.passenger != null &&
      isRunning === true
    ) {
      handlePickup(driver);
    }
  }

  function handlePickup(driver) {
    const startDate = new Date();
    const startDateTicks = dateToTicks(startDate);
    const steps = (100 - driver.speed) * 5;
    driver.Log[driver.completedJobs]["pickingup"] = {};
    driver.path = buildPath(driver.currentLocation, driver.destination);
    processPath(driver.path, steps);
    driverPaths.features[driver.id - 1] = driver.path;
    // driver.totalTicks = startDateTicks - driver.totalTicks;
    map.getSource("routes").setData(driverPaths);

    setTimeout(() => {
      // console.log(
      //   driver.currentLocation[0].toFixed(4),
      //   driver.currentLocation[1].toFixed(4)
      // );
      // console.log(
      //   driver.id,
      //   driver.currentLocation,
      //   driver.destination,
      //   "check this"
      // );

      // if (
      //   driver.currentLocation[0].toFixed(4) ===
      //     driver.destination[0].toFixed(4) &&
      //   driver.currentLocation[1].toFixed(4) ===
      //     driver.destination[1].toFixed(4)
      // ) {
      //   console.log("WE ARRIVED??");
      // } else {
      //   driver.currentLocation = driver.destination;
      // }
      while (
        driver.currentLocation[0].toFixed(4) !==
          driver.destination[0].toFixed(4) &&
        driver.currentLocation[1].toFixed(4) !==
          driver.destination[1].toFixed(4)
      ) {
        //Do nothing, just keep checking
        console.log("checking");
        break;
      }
      console.log("will this print?");
      driver.pickUp();
      const endDate = new Date();
      const endDateTicks = dateToTicks(endDate);

      driver.Log[driver.completedJobs]["pickingup"]["duration"] =
        endDateTicks - startDateTicks;
      const pickupDistance = getDistance(driver.path);
      driver.Log[driver.completedJobs]["pickingup"]["distance"] =
        pickupDistance;
      driver.Log[driver.completedJobs]["pickingup"]["fuel cost"] =
        getFuelCost(pickupDistance);
      console.log(driver.id, driver.Log, "Pick Up Log");
      if (driver.state === "transit" && isRunning === true) {
        // driver.totalTicks = startDateTicks;

        handleTransit(driver);
      }
    }, 8000);
  }

  function handleTransit(driver) {
    const startDate = new Date();
    const startDateTicks = dateToTicks(startDate);
    driver.path = buildPath(driver.currentLocation, driver.destination);
    const steps = (100 - driver.speed) * 5;
    processPath(driver.path, steps);
    driverPaths.features[driver.id - 1] = driver.path;
    driver.Log[driver.completedJobs]["transit"] = {};
    map.getSource("routes").setData(driverPaths);
    driver.counter = 0;
    animatedriver(driver, steps);
    animatepassenger(driver, steps);

    setTimeout(() => {
      //need to debug passenger exit
      driver.currentLocation = driver.destination;
      for (let i = 0; i < passengerPoints.features.length; i++) {
        if (passengerPoints.features[i].properties.id === driver.passenger.id) {
          passengerPoints.features.splice(i, 1);
          map.getSource("passengers").setData(passengerPoints);
        }
        // break;
      }
      // console.log(passengerPoints, "after remove image");

      const endDate = new Date();
      const endDateTicks = dateToTicks(endDate);
      driver.Log[driver.completedJobs]["transit"]["duration"] =
        endDateTicks - startDateTicks;
      const transitDistance = getDistance(driver.path);
      driver.Log[driver.completedJobs]["transit"]["distance"] = transitDistance;
      driver.Log[driver.completedJobs]["transit"]["fuel cost"] =
        getFuelCost(transitDistance);
      // const fare = god.fareCalculation(transitDistance, )
      //  const profit = god.profitCalculation(fare, fuel)
      console.log(driver.id, driver.Log, "Transit Log");
      driver.completed();
      driver.destination = generateRandomCoord();
      driver.path = buildPath(driver.currentLocation, driver.destination);
      processPath(driver.path);
      driverPaths.features[driver.id - 1] = driver.path;
      map.getSource("routes").setData(driverPaths);
      handleSearch(driver);
    }, 8000);
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
        {/* <Button onClick={debugStart}> Debug start</Button>
        <Button onClick={debugPause}> Debug pause</Button>
        <Button onClick={debugContinue}> Debug continue</Button> */}

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
