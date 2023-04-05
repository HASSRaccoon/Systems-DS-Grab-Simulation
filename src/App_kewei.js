import Driver from './Agents/driver.js';
import Passenger from './Agents/passenger.js';
import Globals from './Agents/globals.js';

import sgJSON from "./road-network.json";
import * as turf from "@turf/turf";
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";

import exportFromJSON from 'export-from-json';

function App() {
    //CHANGE PER SIMULATION
    const DAYS = 5; 
    const TICKRATE = 1440; //NOTE: 1 tick = 1 minute
    const TICKS = TICKRATE * DAYS;

    const NUM_DRIVERS = 10;

    // const simulationIter = 10; //cannot work as the simulation stores the data
    const EXPORT = true;

    const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });

    let drivers= []
    for (let i = 0; i < NUM_DRIVERS; i++) {
        drivers.push( //CHANGE PER SIMULATION
                { 
                    id: `C${i}`,
                    speed: 70,
                    state: 'searching',
                    moveTendency: 99999999999999,
                }
            )
        }
    // let drivers = [
    //     { //Type A
    //         id: "A",
    //         speed: 80,
    //         state: 'searching',
    //         moveTendency: 0,
    //     },
    //     { //Type B
    //         id: "B",
    //         speed: 90,
    //         state: 'searching',
    //         moveTendency: 0,
    //     },
    //     { //Type C
    //         id: "C",
    //         speed: 70,
    //         state: 'searching',
    //         moveTendency: 99999999999999,
    //     },
    // ];

    let passengers = [
        {
            id: "passenger1",
            cancelTendency: 1000,
            // currentLocation: generateRandomCoord(),
            // destination: generateRandomCoord(),
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
    let passengerLs = []

    // let cancelled = 0; //DEBUG: for debug purpose

    //spawn drivers
    // drivers.map((driver) => driverLs.push(new Driver(driver)));
    drivers.map((driver) => god.registerDriver(new Driver(driver)));

    passengers.map((passenger) => passengerLs.push(new Passenger(passenger)))


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

    // function generateRandomCoord() {
    //     let featureIndex = Math.floor(Math.random() * sgJSON.features.length)
    //     let coordinateIndex = Math.floor(Math.random() * sgJSON.features[featureIndex].geometry.coordinates.length)

    //     let Pos =
    //       sgJSON.features[featureIndex]
    //         .geometry.coordinates[coordinateIndex];
    //     return Pos;
    // }

    //trying to generate a random coordinate with a certain distance from the current location
    // function generateRandomCoordWithDist(distanceKM) { 
    //     let Pos = this.generateRandomCoord()

    //     let path = this.buildPath(this.currentLocation, Pos);
    //     let dist = turf.length(path, {units: 'kilometers'});

    //     while (dist < distanceKM) {
    //         Pos = this.generateRandomCoord()
    //         path = this.buildPath(this.currentLocation, Pos);
    //         dist = turf.length(path, {units: 'kilometers'});
    //     }

    //     return Pos
    // }

    function assignPassenger(driver) {

        if (passengerLs.length > 0 && driver.state === "searching") {
            let radius = 0;
            // if driver has been searching for less than 5 minutes, search with 2.5km radius, else search with 5km radius
            driver.time < 5 ? radius = 2.5 : driver.time < 7 ? radius = 5 : radius = 7.5;            
            
            let center = turf.point(driver.currentLocation);
            let options = { steps: 64, units: 'kilometers' };
            let circle = turf.circle(center, radius, options); //create circle
            let passengerLsInRadius = passengerLs.filter(passenger => turf.booleanPointInPolygon(turf.point(passenger.currentLocation), circle)); //filter passenger in circle

            console.log('Passengers in '+radius+"(km) "+ driver.id + ": ",passengerLsInRadius)
            //filter passenger that has shortest distance to driver
            let passengerIndex = null;
            if (passengerLsInRadius.length > 1){
                let shortestDist = 100000;
                
                for (let i = 0; i < passengerLsInRadius.length ; i++) { //loop through passengers in circle
                    let currentPassenger = passengerLsInRadius[i];
                    let currentDist = turf.distance(turf.point(driver.currentLocation), turf.point(currentPassenger.currentLocation), {units: 'kilometers'});
                    if (currentDist < shortestDist) {
                        shortestDist = currentDist;
                        passengerIndex = i;
                    }
                }
            }
            else if (passengerLsInRadius.length === 1){
                passengerIndex = 0;
            }

            // Assign passenger to driver
            if (passengerIndex !== null){
                let currentPassenger = passengerLsInRadius[passengerIndex];
                if (currentPassenger.driver === null){ //NOTE: to avoid reassigning passenger to another driver
                    driver.passenger = currentPassenger;
                    currentPassenger.driver = driver;
                    passengerLs = passengerLs.filter(passenger => passenger.id !== currentPassenger.id)
                }
            }
  
        }
    }

    // Old assignPassenger function
    // function assignPassenger(driver) { //TODO: need to assign nearest passenger instead of random assignment
    //     if (passengerLs.length > 0 && driver.state === "searching") {
    //         let passengerIndex = Math.floor(Math.random() * passengerLs.length); //DEBUG: assigning random passenger part
    //         let currentPassenger = passengerLs[passengerIndex];
    //         if (currentPassenger.driver === null){ //NOTE: to avoid reassigning passenger to another driver
    //             driver.passenger = currentPassenger;
    //             currentPassenger.driver = driver;
    //             passengerLs = passengerLs.filter(passenger => passenger.id !== currentPassenger.id)
    //         }
    //     }
    // }

    function newPassenger(){
        let passenger = new Passenger({
            id: "passenger" + generateString(7),
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
        // console.log(driver.state, driver.distanceToTravel)
    }

    function runSim(){
        // --------------------------------- RUN SIMULATION --------------------------------- //
        const startDate = new Date(); //NOTE: start time of simulation
        console.log("(LOG) Start Time: ", startDate.toLocaleTimeString());
        for (let ticks = 0; ticks < TICKS ; ticks++) {
            if (ticks % TICKRATE === 0) console.log("Day: ", 1+(ticks/TICKRATE)); //log everyday

            try{
                //Spawn new passengers every 5 minutes
                let toGenerate = 300 - passengerLs.length 
                if (passengerLs.length < 300){
                    for (let i = 0; i < toGenerate; i++){
                        newPassenger();
                    }
                }

                if (ticks % 60 === 0){ //NOTE: each hour
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
                for (let i = 0; i < god.drivers.length; i++) { //NOTE: loop for each driver
                    let currentDriver = god.drivers[i];
                    if (currentDriver.breakStart < currentDriver.breakEnd ){
                        if (ticks % 1440 >= currentDriver.breakStart && ticks % 1440 <= currentDriver.breakEnd){ //NOTE: if driver on duty, assign passenger
                            console.log('break ' + currentDriver.id, ticks)
                            currentDriver.time = 0;
                            currentDriver.distance = 0;
                            break;
                        }
                    }
                    else{
                        if (ticks % 1440 >= currentDriver.breakStart && ticks % 1440 <= currentDriver.breakEnd){ //NOTE: if driver on duty, assign passenger
                            console.log('break ' + currentDriver.id, ticks)
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
                            break;
                        }
                    }
                    else{
                        if (ticks % 1440 <= currentDriver.startTime && ticks % 1440 >= currentDriver.endTime){ //NOTE: if driver on duty, assign passenger
                            currentDriver.time = 0;
                            currentDriver.distance = 0;
                            break;
                        }
                        else{
                            assignPassenger(currentDriver);
                        }
                    }
                    switch (currentDriver.state) {
                        case "searching":
                            currentDriver.search(currentDriver.passenger, ticks,god);
                            pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                            break;
                        case "picking up":
                            currentDriver.pickUp(ticks,god);
                            currentDriver.passenger.carArrived();
                            pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                            break;
                        case "transit":
                            currentDriver.transit(ticks,god)
                            currentDriver.passenger.transit()
                            pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                            break;
                        case 'completed':
                            currentDriver.passenger.arrived()
                            currentDriver.completed(god)
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
            // if (ticks === TICKS - 1) EXPORT = true;
        }

        let driverlogs = []
        god.drivers.forEach(driver => {
            console.log(`${driver.id}'s log: `, driver.log)
            driverlogs.push({
                key: driver.id,
                log: driver.log
            })
        });

        console.log('driverlogs:',driverlogs)
    // ------------------------------- EXPORT JSON CODE -------------------------------
        if (EXPORT === true){

            let exportType = exportFromJSON.types.json; // set output type
            console.log(`(LOG) Sim Completed: Exporting Data..`);
            
            // console.log("drivers:",god.drivers);
            let data = Object.values(driverlogs); // extract value from array object https://github.com/zheeeng/export-from-json/issues/110
            // console.log("data:",data); 
            const filename = "10C_5Days"; // set filename for export (NOT WORKING :( )
            exportFromJSON({ data, filename, exportType });

        }
        else{
            console.log("(LOG) Sim Completed: Not Exporting")
        }
        
        //get current timing
        let endDate = new Date();
    
        console.log("(LOG) End Time: ", endDate.toLocaleTimeString());
        //get total compute time in minutes
        console.log("(LOG) Total Time: ", (endDate.getTime() - startDate.getTime()) / 60000, "minutes");
        
    }
    
    console.log(`(LOG) Starting Simulation..`);
    runSim();

}


export default App;

