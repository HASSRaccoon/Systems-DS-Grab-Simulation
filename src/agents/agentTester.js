import Driver from "./Driver.js";
import Passenger from "./Passenger.js";

let driver = new Driver(0);

let numPassenger = 1;
let passenger = new Passenger(3 * numPassenger, 10 * numPassenger);

while (passenger) {
  switch (driver.state) {
    case "searching":
      console.log("Searching");
      driver.search(passenger);
      console.log("Searching new passenger...");
      break;
    case "picking up":
      console.log("picking up");
      driver.pickUp();
      passenger.carArrived((Date.now() / 1000) | 0, driver);
      break;
    case "transit":
      console.log("Transiting");
      driver.transit();
      passenger.transit();
      break;
    case "completed":
      driver.completed();
      passenger.arrived();
      console.log("passenger arrived");
      if (passenger.destination == 10) {
        console.log("====================");
        console.log("create new passenger");
        passenger = new Passenger(20, 30);
        numPassenger += 1;
      } else {
        passenger = null;
      }
      break;
  }
}
// NOTE: for this code, passenger location will only changed after driver finished transit
