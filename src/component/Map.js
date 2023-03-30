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

let startPos =
  sgJSON.features[Math.floor(Math.random() * sgJSON.features.length)].geometry
    .coordinates[0];
let endPos =
  sgJSON.features[Math.floor(Math.random() * sgJSON.features.length)].geometry
    .coordinates[0];
// let markerstartPos = [startPos[1], startPos[0]];
// let markerendPos = [endPos[1], endPos[0]];
mapboxgl.accessToken =
  "pk.eyJ1IjoieWVva2V3ZWkiLCJhIjoiY2xlcG5wZ3ZmMGUweTNxdGt4ZG1ldGhsYyJ9.HHNGnKUPolWAo5_UYwzCZg";

export default function Map() {
  function generateRandomCoord() {
    let Pos =
      sgJSON.features[Math.floor(Math.random() * sgJSON.features.length)]
        .geometry.coordinates[0];
    return Pos;
  }
  let god = new Globals();

  let driver1 = new Driver({
    id: 1,
    currentLocation: generateRandomCoord(),
    speed: 70,
    destination: generateRandomCoord(),
    path: null,
    ref: null,
    // search = {search},
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

  const [drivers, setDrivers] = useState([driver1, driver2]);
  const [passengers, setPassengers] = useState([
    passenger1,
    passenger2,
    passenger3,
  ]);

  const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });
  var pathGeo = pathToGeoJSON(
    pathBuilder.findPath(turf.point(startPos), turf.point(endPos))
  );

  //make pathGeo a function
  function buildPath(start, end) {
    const path = pathToGeoJSON(
      pathBuilder.findPath(turf.point(start), turf.point(end))
    );
    return path;
  }

  function processPath(path) {
    const lineDistance = turf.length(path);
    const arc = [];
    const steps = 500;
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(path, i);
      arc.push(segment.geometry.coordinates);
    }
    path.geometry.coordinates = arc;
  }

  // can put into a function
  for (let i = 0; i < drivers.length; i++) {
    const driver = drivers[i];
    driver.path = buildPath(driver.currentLocation, driver.destination);
    processPath(driver.path);
  }

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(103.908009);
  const [lat, setLat] = useState(1.406741);
  const [zoom, setZoom] = useState(14);

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

  // let counter = 0;
  //driverPoints should be a mapping of driverPoint for each driver
  let running = false;
  // let requestId;
  function animatedriver1() {
    // const driver = drivers[driverid - 1];
    // console.log(driver, "is this a driver!");
    // console.log(driverPoints.features[driver.id - 1], "is this a point");
    // console.log(driver, "hello");
    const driver = drivers[0];
    const steps = 500;
    const start =
      driver.path.geometry.coordinates[
        driver.counter >= steps ? driver.counter - 1 : driver.counter
      ];
    const end =
      driver.path.geometry.coordinates[
        driver.counter >= steps ? driver.counter : driver.counter + 1
      ];
    // if (start === end) {
    //   return;
    // }
    if (!start || !end) {
      running = false;
      return;
    }

    driverPoints.features[driver.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[driver.counter];

    driverPoints.features[driver.id - 1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.getSource("drivers").setData(driverPoints);
    if (driver.counter < steps) {
      requestAnimationFrame(animatedriver1);
    }
    driver.counter = driver.counter + 1;
    // console.log(driver.counter, "check");
    // console.log(driver.currentLocation, "update currentLocation");
    // drivers[0].currentLocation = driver.currentLocation;
  }

  function animatedriver2() {
    // const driver = drivers[driverid - 1];
    // console.log(driver, "is this a driver!");
    // console.log(driverPoints.features[driver.id - 1], "is this a point");
    // console.log(driver, "hello");
    const driver = drivers[1];
    const steps = 500;
    const start =
      driver.path.geometry.coordinates[
        driver.counter >= steps ? driver.counter - 1 : driver.counter
      ];
    const end =
      driver.path.geometry.coordinates[
        driver.counter >= steps ? driver.counter : driver.counter + 1
      ];
    // if (start === end) {
    //   return;
    // }
    if (!start || !end) {
      running = false;
      return;
    }
    driverPoints.features[driver.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[driver.counter];

    driverPoints.features[driver.id - 1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.getSource("drivers").setData(driverPoints);
    if (driver.counter < steps) {
      requestAnimationFrame(animatedriver2);
    }
    // drivers[1].currentLocation = driver.currentLocation;
    driver.counter = driver.counter + 1;
    // requestId = requestAnimationFrame(animatedriver); // store the requestId

    // console.log(driver.counter, "hello");
  }

  function animatedriver2passenger() {
    const driver = drivers[1];
    const steps = 500;
    const passenger = driver.passenger;
    const start =
      driver.path.geometry.coordinates[
        passenger.counter >= steps ? passenger.counter - 1 : passenger.counter
      ];
    const end =
      driver.path.geometry.coordinates[
        passenger.counter >= steps ? passenger.counter : passenger.counter + 1
      ];
    // if (start === end) {
    //   return;
    // }
    if (!start || !end) {
      running = false;
      return;
    }
    passengerPoints.features[driver.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[passenger.counter];

    passengerPoints.features[driver.id - 1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.getSource("passengers").setData(passengerPoints);
    if (driver.counter < steps) {
      requestAnimationFrame(animatedriver2passenger);
    }
    passenger.counter = passenger.counter + 1;
  }

  function animatedriver1passenger() {
    const driver = drivers[0];
    const steps = 500;
    const passenger = driver.passenger;
    const start =
      driver.path.geometry.coordinates[
        passenger.counter >= steps ? passenger.counter - 1 : passenger.counter
      ];
    const end =
      driver.path.geometry.coordinates[
        passenger.counter >= steps ? passenger.counter : passenger.counter + 1
      ];
    // if (start === end) {
    //   return;
    // }
    if (!start || !end) {
      running = false;
      return;
    }
    passengerPoints.features[driver.id - 1].geometry.coordinates =
      driver.path.geometry.coordinates[passenger.counter];

    passengerPoints.features[driver.id - 1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.getSource("passengers").setData(passengerPoints);
    if (driver.counter < steps) {
      requestAnimationFrame(animatedriver1passenger);
    }
    passenger.counter = passenger.counter + 1;
  }

  function handleAnimation() {
    animatedriver1();
    animatedriver2();
  }

  function handlePassengerAnimation() {
    //animatedriver1passenger is ok
    //second one got problem
    animatedriver1passenger();
    animatedriver2passenger();
  }

  function startstopAnimation() {
    if (!running) {
      // if animation is not running, start it
      running = true;
      handleAnimation();
    } else {
      // if animation is running, stop it
      running = false;
      // cancelAnimationFrame(requestId); // cancel the animation using the requestId
    }
  }
  //temp assign passengers through a function

  function startAnimation() {
    for (let i = 0; i < drivers.length; i++) {
      let driver = drivers[i];
      handleSearchProper(driver);
      console.log("call search");
    }
  }

  function handleSearchProper(driver) {
    // handleAnimation();
    //assign passenger
    driver.counter = 0;
    if (driver.id === 1) {
      animatedriver1();
    } else if (driver.id === 2) {
      animatedriver2();
    }
    if (passengers.length > 0 && driver.state === "searching") {
      driver.passenger = passengers.pop();
    }
    //pathfinding to passenger
    driver.search(driver.passenger);
    driver.path = buildPath(driver.currentLocation, driver.destination);
    processPath(driver.path);
    driverPaths.features[driver.id - 1] = driver.path;

    if (driver.state === "picking up") {
      handlePickupProper(driver);
      console.log("call pickup");
    }

    //this is pickup alr
    // map.getSource("routes").setData(driverPaths);
    // drivers[driver.id - 1].currentLocation = driver.destination;
  }

  function handlePickupProper(driver) {
    //animate pickingup passenger by setting new route
    console.log(driver);

    map.getSource("routes").setData(driverPaths);

    setTimeout(() => {
      // if (driver.counter === 501) {
      console.log(driver.counter, "counter");
      console.log("complete journey");
      // }
      // if (driver.counter === 501) {
      driver.currentLocation = driver.destination;
      console.log(driver.destination, "old dest");
      driver.pickUp();
      console.log(driver.currentLocation, "loc");
      console.log(driver.destination, "new dest");
      driver.path = buildPath(driver.currentLocation, driver.destination);
      processPath(driver.path);
      driverPaths.features[driver.id - 1] = driver.path;
      if (driver.state === "transit") {
        handleTransitProper(driver);
        console.log("call transit");
        // }
      }
    }, 10000);
  }

  console.log(passengerPoints.features[0].properties.id);
  // console.log(passengerPoints.featuresindexOf(properties=);
  //if passengerPoints.feature
  //for feature in features, if feature.properties.id = driver.passenger.id
  //index = features.indexOf(feature)
  //features.splice(index, 1)

  function handleTransitProper(driver) {
    map.getSource("routes").setData(driverPaths);
    driver.counter = 0;
    if (driver.id === 1) {
      animatedriver1();
      animatedriver1passenger();
    } else if (driver.id === 2) {
      animatedriver2();
      animatedriver2passenger();
    }
    setTimeout(() => {
      // if (driver.counter === 501) {
      console.log(driver.counter, "counter");
      console.log("complete journey");
      //need to debug passenger exit
      driver.currentLocation = driver.destination;
      console.log(passengerPoints, "before remove image");
      for (let i = 0; i < passengerPoints.features.length; i++) {
        if (passengerPoints.features[i].properties.id === driver.passenger.id) {
          let index = passengerPoints.features.indexOf(
            passengerPoints.features[i]
          );
          passengerPoints.features.splice(index, 1);
          break;
        }
      }
      console.log(passengerPoints, "after remove image");

      map.getSource("passengers").setData(passengerPoints);

      driver.completed();
      driver.destination = generateRandomCoord();
      driver.path = buildPath(driver.currentLocation, driver.destination);
      processPath(driver.path);
      driverPaths.features[driver.id - 1] = driver.path;
      map.getSource("routes").setData(driverPaths);
      handleSearchProper(driver);
    }, 10000);
  }

  function handleSearch(driver) {
    // for (let i = 0; i < drivers.length; i++) {
    // let driver = drivers[i];
    driver.search(driver.passenger);

    driver.path = buildPath(driver.currentLocation, driver.destination);
    console.log(driver.path);
    processPath(driver.path);
    console.log(driver.path);
    //add process path
    driverPaths.features[driver.id - 1] = driver.path;
    map.getSource("routes").setData(driverPaths);
    // }
  }

  function handlePassengers() {
    for (let i = 0; i < drivers.length; i++) {
      let driver = drivers[i];

      if (passengers.length > 0 && driver.state === "searching") {
        driver.passenger = passengers.pop();
        console.log(driver.id, driver.passenger, "passenger assigned");
        driver.state = "searching";
        console.log(passengers, "list");
      }
    }
  }

  function handlePickup() {}

  function handleTransit() {
    for (let i = 0; i < drivers.length; i++) {
      let driver = drivers[i];
      driverPoints.features[driver.id - 1].geometry.coordinates =
        driver.currentLocation;
      driver.transit();
      // let passenger = driver.passenger;
      driver.path = buildPath(driver.currentLocation, driver.destination);
      processPath(driver.path);
      driverPaths.features[driver.id - 1] = driver.path;
      map.getSource("routes").setData(driverPaths);
      driver.counter = 0;
      driver.passenger.counter = 0;
      console.log(driver.counter, driver.passenger.counter, "counter");
      console.log(
        driver.currentLocation,
        driver.passenger.currentLocation,
        "this should be the same"
      );
      console.log(
        driver.destination,
        driver.passenger.destination,
        "same dest"
      );
    }
    handleAnimation();
    handlePassengerAnimation();
  }

  function handleDeliver() {
    for (let i = 0; i < drivers.length; i++) {
      let driver = drivers[i];
      console.log(driver);
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

  // useEffect(() => {
  //   setInterval(() => {
  //     for (let i = 0; i < drivers.length; i++) {
  //       let driver = drivers[i];
  //       if (passengers.length > 0 && drivers.state === "searching") {
  //         driver.passenger = passengers.pop();
  //         console.log(driver.passenger, "passenger assigned");
  //         driver.state = "searching";
  //       }
  //     }
  //   }, 1500);
  // }, []);

  return (
    <>
      <div>
        <div className="map-container" ref={mapContainer} />
        <Button onClick={startAnimation}>Start Animation Loop</Button>
        <Button onClick={startstopAnimation}>Start animation only lol</Button>
        {/* Assign passenger */}
        <Button onClick={handlePassengers}>Search</Button>
        <Button onClick={handleSearch}>Pickup</Button>
        {/* <Button onClick={handlePickup}>ignore</Button> */}
        <Button onClick={handleTransit}>Deliver</Button>
        <Button onClick={handleDeliver}>Complete</Button>
        <div> No. of drivers : {drivers.length}</div>
        <div> No. of passengers : {passengers.length}</div>
      </div>
    </>
  );
}
