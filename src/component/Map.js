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
  let driver1;
  driver1 = new Driver({
    id: 1,
    currentLocation: generateRandomCoord(),
    speed: 70,
    destination: generateRandomCoord(),
    path: 0,
  });

  let driver2;
  driver2 = new Driver({
    id: 1,
    currentLocation: generateRandomCoord(),
    speed: 70,
    destination: generateRandomCoord(),
    path: 0,
  });

  const [drivers, setDrivers] = useState([driver1, driver2]);
  // console.log(drivers, "driver list");

  //do passenger later
  // let numPassenger = 1;
  // let passenger = new Passenger(3 * numPassenger, 10 * numPassenger);
  // const [passengers, setPassengers] = useState([passenger]);
  // console.log(passengers, "passenger list");

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

  //can put into a function
  for (let i = 0; i < drivers.length; i++) {
    const driver = drivers[i];
    driver.path = buildPath(driver.currentLocation, driver.destination);
    // console.log(driver.path, "new path");
    const lineDistance = turf.length(driver.path);
    const arc = [];
    const steps = 500;
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(driver.path, i);
      arc.push(segment.geometry.coordinates);
    }
    driver.path.geometry.coordinates = arc;
  }

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(103.908009);
  const [lat, setLat] = useState(1.406741);
  const [zoom, setZoom] = useState(13);

  // const driverpoint = {
  //   type: "FeatureCollection",
  //   features: [
  //     {
  //       type: "Feature",
  //       properties: {},
  //       geometry: {
  //         type: "Point",
  //         coordinates: markerstartPos,
  //       },
  //     },
  //   ],
  // };

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

  const passengerpoint = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: generateRandomCoord(),
        },
      },
    ],
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

  //debug
  let driverPoint = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: driver1.currentLocation,
        },
        properties: {
          id: driver1.id,
        },
      },
    ],
  };

  let running = false;
  function animate() {}

  function handleAnimation() {
    //start animation only for now
    animate();
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
              "line-width": 2,
              "line-color": "#007cbf",
            },
          });

          //show all driver current locations
          map.addSource("drivers", {
            type: "geojson",
            data: driverPoints,
          });

          //show one driver location
          map.addSource("driver", {
            type: "geojson",
            data: driverPoint,
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
          map.addSource("passengerpoint", {
            type: "geojson",
            data: passengerpoint,
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
            id: "passengerpoint",
            source: "passengerpoint",
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
        <Button onClick={handleAnimation}>Start animation only lol</Button>
      </div>
    </>
  );
}
