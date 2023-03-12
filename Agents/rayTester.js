import Globals from "./globals.js";
import Driver from './driver.js';

// create globals and driver
let globals = new Globals();
let driver = new Driver(0, 1);
globals.registerDriver(driver);


// print driver speed
console.log('is raining?', globals.raining)
console.log('Driver speed:', driver.speed);

globals.raining = true;
console.log('is raining?', globals.raining)

// print updated driver speed
console.log('Driver speed:', driver.speed);

// change weather from wet to dry
globals.raining = false;
console.log('is raining?', globals.raining)

// print updated driver speed
console.log('Driver speed:', driver.speed);


