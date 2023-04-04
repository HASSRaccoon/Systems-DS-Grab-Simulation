import Driver from './Agents/driver.js';
import Passenger from './Agents/passenger.js';
import Globals from './Agents/globals.js';
import sgJSON from "./road-network.json";
import * as turf from "@turf/turf";

import PathFinder, { pathToGeoJSON } from "geojson-path-finder";

function App() {
    let days = 1;

     // Functions for map related actions
     const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });

    // function to build path from json file, start and end points
    function buildPath(start, end) {
        const path = pathToGeoJSON(
            pathBuilder.findPath(turf.point(start), turf.point(end))
        );
        return path;
    }

    function generateRandomCoord() {
        let Pos =
            sgJSON.features[Math.floor(Math.random() * sgJSON.features.length)]
                .geometry.coordinates[0];
        return Pos;
    }

    let drivers = [
        {
            id: "driver1",
            speed: 70,
            state: 'searching',
            moveTendency: 0.3,
        },
        {
            id: "driver2",
            speed: 50,
            state: 'searching',
            moveTendency: 0.8,
        },
    ];

    let passengers = [
        {
            id: "passenger1",
            cancelTendency: 5,
        },
        {
            id: "passenger2",
            cancelTendency: 10,
        },
        {
            id: "passenger3",
            cancelTendency: 7,
        },
        {
            id: "passenger4",
            cancelTendency: 4,
        },
    ];

    let god = new Globals();

    let driverLs = []
    let passengerLs = []

    let cancelled = 0; //DEBUG: for debug purpose

    drivers.map((driver) => driverLs.push(new Driver(driver)))
    passengers.map((passenger) => passengerLs.push(new Passenger(passenger)))

    function assignPassenger(driver) { //DEBUG: need to assign nearest passenger instead of random assignment
        if (passengerLs.length > 0 && driver.state === "searching") {
            let passengerIndex = Math.floor(Math.random() * passengerLs.length); //DEBUG: assigning random passenger part
            let currentPassenger = passengerLs[passengerIndex];
            if (currentPassenger.driver === null){ //NOTE: to avoid reassigning passenger to another driver
                driver.passenger = currentPassenger;
                currentPassenger.driver = driver;
                passengerLs = passengerLs.filter(passenger => passenger.id !== currentPassenger.id) //DEBUG: remove passenger from list
            }
            if (currentPassenger.driver === null || driver.passenger === null){ //DEBUG: for debug purpose
                console.log('bug');
                assignPassenger(driver)
            }
        }
    }

    function newPassenger(){
        let passenger = new Passenger({
            id: "passenger" + passengerLs.length, //FIXME: need a unique id
            currentLocation: generateRandomCoord(), //DEBUG: json location
            destination: generateRandomCoord(), //DEBUG: json location
            cancelTendency: Math.floor(Math.random())*10, //DEBUG: random cancel tendency
        })
        passengerLs.push(passenger)
    }

    function pathGenerator(driver, location, destination){
        if (!location){
            location = generateRandomCoord();
        }
        if (!destination){
            destination = location;
        }
        if (location.length <= 2 || destination.length <= 2){
            console.log('bug');
            console.log(location);
            console.log(destination);
        }
        let path = buildPath(location, destination)
        driver.path = path;
        if (driver.distanceToTravel === 0){
            driver.distanceToTravel = turf.length(path, {units: 'kilometers'})
        }
        console.log(driver.state, driver.distanceToTravel)
    }

    for (let ticks = 0; ticks < 1000 * days; ticks++) {
        try{
            // FIXME: how to add new passenger, current is to add new passenger every ticks
            newPassenger(); 
            if (ticks % 60 == 0){ //NOTE: each hour
                if (Math.random() < 0.5){ //NOTE: rain probability
                    god.raining = true;
                }
                else{
                    god.raining = false;
                }
            }
            for (let i = 0; i < passengerLs.length; i++){ //NOTE: passenger cancelling
                passengerLs[i].waitingTime += 1;
                if (passengerLs[i].waitingTime >= passengerLs[i].cancelTendency){
                    let cancelRate = Math.random();
                    if (cancelRate > 0.9){
                        passengerLs[i].cancel()
                        if (passengerLs[i].driver !== null){
                            passengerLs[i].driver.passenger = null;
                            passengerLs[i].driver.cancelledJobs += 1;
                            passengerLs[i].driver.state = "searching";
                        }
                        else{ //DEBUG: for debug purpose
                            cancelled += 1;
                        }
                    passengerLs = passengerLs.filter(passenger => passenger.id !== passengerLs[i].id)
                    }
                }
            }
            for (let i = 0; i < driverLs.length; i++) { //NOTE: loop for each driver
                let currentDriver = driverLs[i];
                if (ticks % 1440 >= currentDriver.startTime && ticks % 1440 <= currentDriver.endTime){ //NOTE: if driver on duty, assign passenger
                    assignPassenger(currentDriver);
                }
                else{
                    currentDriver.time = 0;
                    currentDriver.distance = 0;
                }
                switch (currentDriver.state) {
                    case "searching":
                        currentDriver.search(currentDriver.passenger, ticks);
                        pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                        break;
                    case "picking up":
                        currentDriver.pickUp(ticks);
                        currentDriver.passenger.carArrived();
                        pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                        break;
                    case "transit":
                        currentDriver.transit(ticks)
                        currentDriver.passenger.transit()
                        pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                        break;
                    case 'completed':
                        currentDriver.passenger.arrived()
                        currentDriver.completed(ticks)
                        break;
                    default:
                        currentDriver.search(currentDriver.passenger)
                        break;
                }
            }
        }
        catch (e){
            console.log(e)
        }
    }

    driverLs.forEach(driver => {
        console.log(`${driver.id}'s log`)
        console.log(driver.log)
    });
    console.log(`cancelled: ${cancelled}`)
}

export default App;

//TODO: output to usable data -> json (KW)
//TODO: tendency: number of ticks willing to wait, driver waiting (KW)