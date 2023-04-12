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
    const NUM_PASSENGERS = 300;

    // const simulationIter = 10; //cannot work as the simulation stores the data
    const EXPORT = true;

    const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-5 });

    //CHANGE PER SIMULATION

    let drivers= []
    for (let i = 0; i < NUM_DRIVERS; i++) {

        // Type A
        // drivers.push( //CHANGE PER SIMULATION
        //         { 
        //             id: `A${i}`,
        //             speed: 80,
        //             state: 'searching',
        //             framesToMove: 0,
        //             moveRadius: 5,
        //             startTime: 1020, //NOTE: 5pm
        //             endTime: 240, //NOTE: 4am
        //             breakStart: 0, //NOTE: 12am
        //             breakEnd: 60, //NOTE: 1am
        //         }
        //     );

        //Type B
        // drivers.push( //CHANGE PER SIMULATION
        //         { 
        //             id: `B${i}`,
        //             speed: 90,
        //             state: 'searching',
        //             framesToMove: 0,
        //             moveRadius: 5,
        //             startTime: 420, //NOTE: 7am
        //             endTime: 1140, //NOTE: 7pm
        //             breakStart: 600, //NOTE: 10am
        //             breakEnd: 660, //NOTE: 11am                    
        //         }
        //     );

        //Type C
        drivers.push( //CHANGE PER SIMULATION
                { 
                    id: `C${i}`,
                    speed: 70,
                    state: 'searching',
                    framesToMove: 9999999,
                    moveRadius: 0,
                    startTime: 480, //NOTE: 8am
                    endTime: 1080, //NOTE: 6pm
                    breakStart: 660, //NOTE: 10am
                    breakEnd: 720, //NOTE: 11am
                }
            );



        }

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

    function assignPassenger(driver) {
        console.log('assigning passenger')
        if (passengerLs.length > 0 && driver.state === "searching") {
            
            let radius = 0;
            // if driver has been searching for less than 5 minutes, search with 2.5km radius, else search with 5km radius
            driver.time < 5 ? radius = 2.5 : driver.time < 7 ? radius = 5 : radius = 7.5;
            driver.radius = radius;            
            // console.log( '','radius: ', radius)
            let center = turf.point(driver.currentLocation);
            let options = { steps: 64, units: 'kilometers' };
            let circle = turf.circle(center, radius, options); //create circle
            let passengerLsInRadius = passengerLs.filter(passenger => turf.booleanPointInPolygon(turf.point(passenger.currentLocation), circle)); //filter passenger in circle

            console.log('Passengers in '+radius+"(km) "+ driver.id + ": ",passengerLsInRadius.length)
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
                if (shortestDist > radius)
                {console.log('(LOG ERROR) shortestDist: ', shortestDist, 'passengerIndex: ', passengerIndex)}
            }
            else if (passengerLsInRadius.length === 1){
                passengerIndex = 0;
            }
            else{
                console.log('no passengers in radius')
            }

            // Assign passenger to driver
            if (passengerIndex !== null){
                let currentPassenger = passengerLsInRadius[passengerIndex];
                if (currentPassenger.driver === null){ //NOTE: to avoid reassigning passenger to another driver
                    driver.passenger = currentPassenger; //assign passenger to driver
                    currentPassenger.driver = driver; //assign driver to passenger
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
        if (location === destination || destination === null) return;
        console.log('pathGenerator driver ', driver.id,' loc: ', location, ' dest: ', destination)
        let path = buildPath(location, destination)
        driver.path = path;
        console.log('pathGenerator driver ', driver.id,' path: ', path)
        if (driver.distanceToTravel === 0 && (driver.path !== null || driver.path !== undefined)){
            driver.distanceToTravel = turf.length(path, {units: 'kilometers'});
        }

    }
    function updateCurrentLoc(driver,location,destination,distance){
        if (location === destination || destination === null) return;

        if (driver.path !== null || driver.path !== undefined){
            let path = driver.path;
            // console.log('Updatecurrentloc driver ', driver.id,' path: ', path)
            let along = turf.along(path,distance,{units: 'kilometers'});

            console.log('along: ', along.geometry.coordinates);
            driver.currentLocation = along.geometry.coordinates;
            console.log('currentLocation: ', driver.currentLocation);
            if(driver.currentLocation === driver.destination)return;
            let newPath = buildPath(driver.currentLocation, driver.destination);
            driver.path = newPath;
            driver.distanceToTravel = turf.length(path, {units: 'kilometers'});
        }
    }

    function runSim(){
        // --------------------------------- RUN SIMULATION --------------------------------- //
        const startDate = new Date(); //NOTE: start time of simulation
        console.log("(LOG) Start Time: ", startDate.toLocaleTimeString());
        for (let ticks = 0; ticks < TICKS ; ticks++) {
            if (ticks % TICKRATE === 0) console.log("(LOG) Day: ", 1+(ticks/TICKRATE)); //log everyday
            
            try{
                let toGenerate = NUM_PASSENGERS - passengerLs.length 
                if (passengerLs.length < NUM_PASSENGERS){
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
                            if (currentDriver.state === 'searching' && !currentDriver.passenger){
                                assignPassenger(currentDriver);
                            }
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
                            if (currentDriver.state === 'searching' && !currentDriver.passenger){
                                assignPassenger(currentDriver);
                            }
                        }
                    }
                    switch (currentDriver.state) {
                        case "searching":
                            // let hasMoved = currentDriver.search(currentDriver.passenger, ticks, god);
                            // if (hasMoved){
                            //     pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination,currentDriver.distancePerTick(currentDriver.speed),true);
                            // }currentDriver.search(currentDriver.passenger, ticks,god);
                            let isMoving = currentDriver.search(currentDriver.passenger, ticks, god);
                            // pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                            if (isMoving){
                                updateCurrentLoc(
                                    currentDriver,
                                    currentDriver.currentLocation,
                                    currentDriver.destination, 
                                    currentDriver.distancePerTick(currentDriver.speed)
                                    );
                            }
                            else{
                                pathGenerator(
                                    currentDriver,
                                    currentDriver.currentLocation,
                                    currentDriver.destination
                                    );
                            }
                            break;
                        case "picking up":
                            // let hasPicked = currentDriver.pickUp(ticks,god);
                            // currentDriver.passenger.carArrived();
                            // if (hasPicked){
                            //     pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination,currentDriver.distancePerTick(currentDriver.speed),false);
                            // }
                            currentDriver.pickUp(ticks,god);
                            currentDriver.passenger.carArrived();
                            pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);
                            break;
                        case "transit":
                            // let hasReached = currentDriver.transit(ticks,god);
                            // currentDriver.passenger.transit();
                            // if (hasReached){
                            //     pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination,currentDriver.distancePerTick(currentDriver.speed),false);
                            // }
                            currentDriver.transit(ticks,god)
                            currentDriver.passenger.transit()
                            pathGenerator(currentDriver, currentDriver.currentLocation, currentDriver.destination);

                            break;
                        case 'completed':
                            currentDriver.passenger.arrived()
                            currentDriver.completed(god)
                            break;
                        default:
                            currentDriver.search(currentDriver.passenger, ticks, god);
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

