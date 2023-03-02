import Driver from './driver.js';
import Passenger from './passenger.js';

let driver = new Driver(0);
let passenger = new Passenger(3, 10);

if (passenger){
    driver.pickUp(passenger);
    passenger.carArrived(Date.now() / 1000 | 0, driver);
    console.log('=============')
    console.log(driver.state)
    console.log(passenger.state)
    driver.transit()
    passenger.transit()
    console.log('=============')
    console.log(driver.state)
    console.log(passenger.state)
    passenger.arrived()
    driver.completed()
    console.log('=============')
    console.log(driver.state)
    console.log(passenger.state)
}

// NOTE: for this code, passenger location will only changed after driver finished transit