import Driver from './Agents/driver.js';
import Passenger from './Agents/passenger.js';
import Globals from './Agents/globals.js';

import sgJSON from "./road-network.json";
import * as turf from "@turf/turf";
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";

import exportFromJSON from 'export-from-json';

function App() {
    const DAYS = 1;
    const TICKRATE = 1440; //NOTE: 1 tick = 1 minute
    const TICKS = TICKRATE * DAYS;

    let EXPORT = false;

    const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });

    function buildPath(start, end) {
        const path = pathToGeoJSON(
            pathBuilder.findPath(turf.point(start), turf.point(end))
        );
        return path;
    }

    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
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
            moveTendency: 3,
        },
        {
            id: "driver2",
            speed: 50,
            state: 'searching',
            moveTendency: 5,
        },
    ];

    let passengers = [
        {
            id: "passenger1",
            cancelTendency: 1000,
        },
        {
            id: "passenger2",
            cancelTendency: 1000,
        },
        {
            id: "passenger3",
            cancelTendency: 1000,
        },
        {
            id: "passenger4",
            cancelTendency: 1000,
        },
    ];

    let god = new Globals();

    let driverLs = []
    let passengerLs = []

    let cancelled = 0; //DEBUG: for debug purpose

    drivers.map((driver) => driverLs.push(new Driver(driver)))
    passengers.map((passenger) => passengerLs.push(new Passenger(passenger)))

    function assignPassenger(driver) { //TODO: need to assign nearest passenger instead of random assignment
        if (passengerLs.length > 0 && driver.state === "searching") {
            let passengerIndex = Math.floor(Math.random() * passengerLs.length); //DEBUG: assigning random passenger part
            let currentPassenger = passengerLs[passengerIndex];
            if (currentPassenger.driver === null){ //NOTE: to avoid reassigning passenger to another driver
                driver.passenger = currentPassenger;
                currentPassenger.driver = driver;
                passengerLs = passengerLs.filter(passenger => passenger.id !== currentPassenger.id)
            }
        }
    }

    function newPassenger(){
        let passenger = new Passenger({
            id: "passenger" + generateString(7),
            currentLocation: generateRandomCoord(),
            destination: generateRandomCoord(),
            cancelTendency: Math.floor(Math.random())*10,
        })
        passengerLs.push(passenger)
    }

    function pathGenerator(driver, location, destination){
        if (location === destination)return;
        let path = buildPath(location, destination)
        driver.path = path;
        if (driver.distanceToTravel === 0){
            driver.distanceToTravel = turf.length(path, {units: 'kilometers'})
        }
        console.log(driver.state, driver.distanceToTravel)
    }

    for (let ticks = 0; ticks < TICKS ; ticks++) {
        try{
            let toGenerate = 1000 - passengerLs.length 
            if (passengerLs.length < 1000){
                for (let i = 0; i < toGenerate; i++){
                    newPassenger();
                }
            }
            if (ticks % 60 == 0){ //NOTE: each hour
                if (Math.random() < 0.5){ //NOTE: rain probability
                    god.raining = true;
                }
                else{
                    god.raining = false;
                }
            }
            // for (let i = 0; i < passengerLs.length; i++){ //NOTE: passenger cancelling
            //     passengerLs[i].waitingTime += 1;
            //     if (passengerLs[i].waitingTime >= passengerLs[i].cancelTendency){
            //         let cancelRate = Math.random();
            //         if (cancelRate > 0.9){
            //             passengerLs[i].cancel()
            //             if (passengerLs[i].driver !== null){
            //                 passengerLs[i].driver.passenger = null;
            //                 passengerLs[i].driver.cancelledJobs += 1;
            //                 passengerLs[i].driver.state = "searching";
            //             }
            //             else{ //DEBUG: for debug purpose
            //                 cancelled += 1;
            //             }
            //         passengerLs = passengerLs.filter(passenger => passenger.id !== passengerLs[i].id)
            //         }
            //     }
            // }
            for (let i = 0; i < driverLs.length; i++) { //NOTE: loop for each driver
                let currentDriver = driverLs[i];
                if (currentDriver.breakStart < currentDriver.breakEnd ){
                    if (ticks % 1440 >= currentDriver.breakStart && ticks % 1440 <= currentDriver.breakEnd){ //NOTE: if driver on duty, assign passenger
                        console.log('break', ticks)
                        currentDriver.time = 0;
                        currentDriver.distance = 0;
                        break;
                    }
                }
                else{
                    if (ticks % 1440 >= currentDriver.breakStart && ticks % 1440 <= currentDriver.breakEnd){ //NOTE: if driver on duty, assign passenger
                        console.log('break', ticks)
                        currentDriver.time = 0;
                        currentDriver.distance = 0;
                        break;
                    }
                }
                if (currentDriver.startTime < currentDriver.endTime){
                    if (ticks % 1440 >= currentDriver.startTime && ticks % 1440 <= currentDriver.endTime){ //NOTE: if driver on duty, assign passenger
                        assignPassenger(currentDriver);
                    }
                    else{
                        currentDriver.time = 0;
                        currentDriver.distance = 0;
                    }
                }
                else{
                    if (ticks % 1440 <= currentDriver.startTime && ticks % 1440 >= currentDriver.endTime){ //NOTE: if driver on duty, assign passenger
                        currentDriver.time = 0;
                        currentDriver.distance = 0;
                    }
                    else{
                        assignPassenger(currentDriver);
                    }
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
        if (ticks === TICKS - 1) EXPORT = true;
    }

    let driverlogs = []
    driverLs.forEach(driver => {
        console.log(`${driver.id}'s log`)
        console.log(driver.log)
        driverlogs.push({
            key: driver.id,
            log: driver.log
        })
    });

    console.log('driverlogs:',driverlogs)
  // ------------------------------- EXPORT JSON CODE -------------------------------
    if (EXPORT == true){

        let exportType = exportFromJSON.types.json; // set output type
        console.log(`JSONing driverLs logs`);
        let fileName = 'driverLs'; // set file name
        // console.log("driverls:",driverLs);
        let data = Object.values(driverlogs); // extract value from array object https://github.com/zheeeng/export-from-json/issues/110
        // console.log("data:",data); 
        try{
            exportFromJSON({ data, fileName, exportType });
        }
        catch(err){
            console.log(err);
        }
    }

}


export default App;

//TODO: tendency: number of ticks willing to wait, driver waiting (KW)
