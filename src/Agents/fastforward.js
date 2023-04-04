import Driver from './driver.js';
import Passenger from './passenger.js';

let days = 1; //DEBUG:

let drivers = [
    {
        id: "driver1",
        currentLocation: [Math.random()*200,Math.random()*200], //DEBUG: json location
        speed: 70,
        state: 'searching',
        moveTendency: 0.3,
    },
    // {
    //     id: "driver2",
    //     currentLocation: [Math.random()*200,Math.random()*200], //DEBUG: json location
    //     speed: 50,
    //     state: 'searching',
    //     moveTendency: 0.8,
    // },
];

let passengers = [
    {
        id: "passenger1",
        currentLocation: [Math.random()*200,Math.random()*200], //DEBUG: json location
        destination: [Math.random()*200,Math.random()*200], //DEBUG: json location
        cancelTendency: 0.05,
    },
    // {
    //     id: "passenger2",
    //     currentLocation: [Math.random()*200,Math.random()*200], //DEBUG: json location
    //     destination: [Math.random()*200,Math.random()*200], //DEBUG: json location
    //     cancelTendency: 1,
    // },
    // {
    //     id: "passenger3",
    //     currentLocation: [Math.random()*200,Math.random()*200], //DEBUG: json location
    //     destination: [Math.random()*200,Math.random()*200], //DEBUG: json location
    //     cancelTendency: 0.01,
    // },
    // {
    //     id: "passenger4",
    //     currentLocation: [Math.random()*200,Math.random()*200], //DEBUG: json location
    //     destination: [Math.random()*200,Math.random()*200], //DEBUG: json location
    //     cancelTendency: 1,
    // },
];

let driverLs = []
let passengerLs = []

drivers.map((driver) => driverLs.push(new Driver(driver)))
passengers.map((passenger) => passengerLs.push(new Passenger(passenger)))

function assignPassenger(driver) { //DEBUG: need to assign nearest passenger instead of random assignment
    if (passengerLs.length > 0 && driver.state === "searching") {
        let passengerIndex = Math.floor(Math.random() * passengerLs.length); //DEBUG: assigning random passenger part
        currentPassenger = passengerLs[passengerIndex];
        if (currentPassenger.driver === null){
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

for (let ticks = 0; ticks < 1440 * days; ticks++) {
    for (let i = 0; i < driverLs.length; i++) { //NOTE: loop for each driver
        let currentDriver = driverLs[i];
        assignPassenger(currentDriver)
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
        switch (currentDriver.state) {
            case "searching":
                currentDriver.search(currentDriver.passenger)
                break;
            case "picking up":
                currentDriver.pickUp()
                currentDriver.passenger.carArrived(Date.now() / 1000 | 0)
                break;
            case "transit":
                currentDriver.transit()
                currentDriver.passenger.transit()
                break;
            case 'completed':
                currentDriver.passenger.arrived()
                currentDriver.completed()
                break;
            default:
                currentDriver.search(currentDriver.passenger)
                break;
        }
    }
}