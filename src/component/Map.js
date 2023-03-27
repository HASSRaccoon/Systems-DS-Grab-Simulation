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
  let driver = new Driver(0);
  //what is numPassenger
  let numPassenger = 1;
  let passenger = new Passenger(3 * numPassenger, 10 * numPassenger);

  const [drivers, setDrivers] = useState([driver]);
  console.log(drivers, "driver list");
  const [passengers, setPassengers] = useState([passenger]);
  console.log(passengers, "passenger list");

  const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });
  var pathGeo = pathToGeoJSON(
    pathBuilder.findPath(turf.point(startPos), turf.point(endPos))
  );
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(103.908009);
  const [lat, setLat] = useState(1.406741);
  const [zoom, setZoom] = useState(13);
  const markerstartPos = startPos;
  const driverpoint = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: markerstartPos,
        },
      },
    ],
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
  console.log(driverpoint.features[0].geometry.coordinates, "coordinates");
  const lineDistance = turf.length(pathGeo);
  const arc = [];
  const steps = 500;
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(pathGeo, i);
    arc.push(segment.geometry.coordinates);
  }
  pathGeo.geometry.coordinates = arc;
  //arc formed by small segments
  console.log(pathGeo.geometry.coordinates, "arc");
  let counter = 0;
  let running = false;
  function animate() {
    running = true;
    const start =
      pathGeo.geometry.coordinates[counter >= steps ? counter - 1 : counter];
    const end =
      pathGeo.geometry.coordinates[counter >= steps ? counter : counter + 1];
    if (!start || !end) {
      running = false;
      return;
    }
    driverpoint.features[0].geometry.coordinates =
      pathGeo.geometry.coordinates[counter];
    console.log(
      driverpoint.features[0].geometry.coordinates,
      "new coordinates"
    );

    driverpoint.features[0].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );
    console.log(driverpoint.features[0].geometry.coordinates, "new bearing");

    map.getSource("point").setData(driverpoint);

    if (counter < steps) {
      requestAnimationFrame(animate);
    }
    counter = counter + 1;
  }
  function handleAnimation() {
    //start animation only
    animate();
  }
  useEffect(() => {
    setDrivers(driver);
    console.log("check driverslist", drivers);
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    console.log(map, "map");
    console.log(pathGeo, "path");

    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);
          map.addSource("route", {
            type: "geojson",
            data: pathGeo,
          });
          //driver
          map.addSource("driverpoint", {
            type: "geojson",
            data: driverpoint,
          });
          //passenger
          map.addSource("passengerpoint", {
            type: "geojson",
            data: passengerpoint,
          });

          map.addLayer({
            id: "route",
            source: "route",
            type: "line",
            paint: {
              "line-width": 2,
              "line-color": "#007cbf",
            },
          });

          map.addLayer({
            id: "driverpoint",
            source: "driverpoint",
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
        <Button onClick={handleAnimation}>Start/Stop</Button>
        <div className="map-container" ref={mapContainer} />
      </div>
    </>
  );
}
