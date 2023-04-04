import Driver from './driver.js';
import Passenger from './passenger.js';
import Globals from './globals.js';

let days = 30; //DEBUG:

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
        cancelTendency: 0,
    },
    {
        id: "passenger2",
        cancelTendency: 0,
    },
    {
        id: "passenger3",
        cancelTendency: 0,
    },
    {
        id: "passenger4",
        cancelTendency: 0,
    },
];

let god = new Globals();

let driverLs = []
let passengerLs = []

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
        id: "passenger" + passengerLs.length,
        currentLocation: [Math.random()*200,Math.random()*200], //DEBUG: json location
        destination: [Math.random()*200,Math.random()*200], //DEBUG: json location
        cancelTendency: 0,
    })
    passengerLs.push(passenger)
}

for (let ticks = 0; ticks < 1440 * days; ticks++) {
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
        let passengerRandom = Math.random();
        if (passengerRandom < passengerLs[i].cancelTendency && passengerLs[i].state === 'waiting'){
            console.log('passenger cancelling')
            passengerLs[i].cancel()
            if (passengerLs[i].driver !== null){
                passengerLs[i].driver.passenger = null;
                passengerLs[i].driver.state = "searching"
                passengerLs[i].driver.search(null)
            }
            passengerLs = passengerLs.filter(passenger => passenger.id !== passengerLs[i].id)
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
                // console.log('searching')
                currentDriver.search(currentDriver.passenger)
                break;
            case "picking up":
                // console.log('picking up')
                currentDriver.pickUp()
                currentDriver.passenger.carArrived(Date.now() / 1000 | 0)
                break;
            case "transit":
                // console.log('transit')
                currentDriver.transit()
                currentDriver.passenger.transit()
                break;
            case 'completed':
                // console.log('completed')
                currentDriver.passenger.arrived()
                currentDriver.completed()
                break;
            default:
                currentDriver.search(currentDriver.passenger)
                break;
        }
    }
}

// print log for each driver after end of simulation, can be log every day etc
driverLs.forEach(driver => {
    console.log(`${driver.id}'s log`)
    console.log(driver.log)
});