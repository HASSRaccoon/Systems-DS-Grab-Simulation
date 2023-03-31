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

  let running = false;

  const [drivers, setDrivers] = useState([driver1, driver2]);

  const [passengers, setPassengers] = useState([
    passenger1,
    passenger2,
    passenger3,
  ]);

  console.log(passengers);

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
    const steps = driver.speed * 5;
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

  function dateToTicks(date) {
    const epochOffset = 621355968000000000;
    const ticksPerMillisecond = 10000;

    const ticks = date.getTime() * ticksPerMillisecond + epochOffset;

    return ticks;
  }

  // function handledebug() {
  //   const steps = 500;
  //   for (let i = 0; i < drivers.length; i++) {
  //     const driver = drivers[i];
  //     driver.counter = 0;

  //     animatedriver(driver, steps);
  //   }
  // }

  function animatedriver(driver, steps) {
    // console.log(driver);
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
      requestAnimationFrame(() => animatedriver(driver, steps));
    }

    driver.counter = driver.counter + 1;
    // console.log(driver.currentLocation, driver.counter);
  }

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
      requestAnimationFrame(() => animatepassenger(driver, steps));
    }

    driver.passenger.counter = driver.passenger.counter + 1;
  }

  function startAnimation() {
    // spawnPassengerWithProbability(spawnProbability);
    for (let i = 0; i < drivers.length; i++) {
      let driver = drivers[i];
      handleSearch(driver);
    }
  }

  function handleSearch(driver) {
    console.log("called search");
    driver.counter = 0;
    const steps = driver.speed * 5;
    animatedriver(driver, steps);

    if (passengers.length > 0 && driver.state === "searching") {
      driver.passenger = passengers[driver.id];
    }
    console.log(driver.passenger, "no passenger");
    //pathfinding to passenger
    driver.search(driver.passenger);
    driver.path = buildPath(driver.currentLocation, driver.destination);
    processPath(driver.path, steps);
    driverPaths.features[driver.id - 1] = driver.path;

    if (driver.state === "picking up" && driver.passenger != null) {
      handlePickup(driver);
      console.log("call pickup");
    }
  }

  function handlePickup(driver) {
    //animate pickingup passenger by setting new route

    map.getSource("routes").setData(driverPaths);

    setTimeout(() => {
      console.log(
        driver.currentLocation[0].toFixed(4),
        driver.currentLocation[1].toFixed(4)
      );
      console.log(
        driver.id,
        driver.currentLocation,
        driver.destination,
        "check this"
      );

      if (
        driver.currentLocation[0].toFixed(4) ===
          driver.destination[0].toFixed(4) &&
        driver.currentLocation[1].toFixed(4) ===
          driver.destination[1].toFixed(4)
      ) {
        console.log("WE ARRIVED??");
      } else {
        driver.currentLocation = driver.destination;
      }

      driver.pickUp();
      driver.path = buildPath(driver.currentLocation, driver.destination);
      const steps = driver.speed * 5;
      processPath(driver.path, steps);
      driverPaths.features[driver.id - 1] = driver.path;
      if (driver.state === "transit") {
        handleTransit(driver);
        console.log("call transit");
        // }
      }
    }, 8000);
  }

  function handleTransit(driver) {
    map.getSource("routes").setData(driverPaths);
    driver.counter = 0;
    const steps = driver.speed * 5;
    animatedriver(driver, steps);
    animatepassenger(driver, steps);

    setTimeout(() => {
      // if (driver.counter === 501) {
      console.log(driver.counter, "counter");
      console.log("complete journey");
      //need to debug passenger exit
      driver.currentLocation = driver.destination;

      for (let i = 0; i < passengerPoints.features.length; i++) {
        if (passengerPoints.features[i].properties.id === driver.passenger.id) {
          console.log(driver.passenger.id);
          console.log(passengerPoints.features[i].properties.id);
          console.log(passengerPoints.features.length, "before");
          passengerPoints.features.splice(i, 1);
          console.log(passengerPoints.features.length, "after");
          map.getSource("passengers").setData(passengerPoints);
        }
        // break;
      }
      console.log(passengerPoints, "after remove image");

      driver.completed();
      driver.destination = generateRandomCoord();
      driver.path = buildPath(driver.currentLocation, driver.destination);
      processPath(driver.path);
      driverPaths.features[driver.id - 1] = driver.path;
      map.getSource("routes").setData(driverPaths);
      handleSearch(driver);
    }, 10000);
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
        {/* <Button onClick={handledebug}>DeBUG</Button> */}
        <Button onClick={spawnPassenger}>Spawn Passenger</Button>
        <Button onClick={startAnimation}>Start Animation Loop</Button>
        <div> No. of drivers : {drivers.length}</div>
        <div> No. of passengers : {passengers.length}</div>
      </div>
    </>
  );
}
