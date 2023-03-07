import Driver from './driver.js';
import {passenger} from './passenger.js';

let location,speed
let driver1 = new Driver(location=0, speed=1);
console.log(driver1)

let numPassenger = 1;
let passenger1 = new passenger(3*numPassenger, 10*numPassenger, driver1)

while (passenger1){
    switch (driver1.state){
        case 'searching':
            console.log("Searching")
            driver1.search(passenger1);
            console.log('Searching new passenger...')
            break;
        case 'picking up':
            console.log('picking up')
            driver1.pickUp();
            passenger1.carArrived(Date.now() / 1000 | 0, driver1);
            break;
        case 'transit':
            console.log('Transiting')
            driver1.transit();
            passenger1.transit();
            break
        case 'completed':
            driver1.completed();
            passenger1.arrived();
            console.log('passenger arrived')
            if (passenger1.destination == 10){
                console.log('====================')
                console.log('create new passenger')
                passenger1 = new passenger(20, 30);
                numPassenger += 1;
            }
            else{
                passenger = null;
            }
            break
    }
}
// NOTE: for this code, passenger location will only changed after driver finished transit