import React from "react";
import styles from "./styles.module.css";
import { moveTo } from "./move.js";

export default class Passenger {
  constructor(props) {
    this.state = "waiting";
    this.currentLocation = props.currentLocation;
    this.destination = props.destination;
    this.waitingTime = 0;
    this.driver = null;
    this.ref = props.ref;
    this.id = props.id;

    this.appearTime = (Date.now() / 1000) | 0;
    console.log(`Passenger appear at ${this.appearTime}`);
  }

  // do we need a state for car not arrived yet?

  carArrived(timestamp, driver) {
    this.driver = driver;
    this.state = "transit";
    if (this.driver.currentLocation == this.currentLocation) {
      this.waitingTime = timestamp - this.appearTime;
      console.log(`Passenger waiting time: ${this.waitingTime}`);
      this.state = "transit";
    }
  }
  transit() {
    // this.currentLocation = this.driver.currentLocation; //FIXME: update the current location of the passenger while transiting (same as grab's location)
    console.log(
      `passenger current location when transit: ${this.currentLocation}`
    );
    moveTo(
      this.ref.current,
      this.currentLocation,
      this.destination,
      this.ref,
      this.driver.speed
    );
  }
  arrived() {
    this.state = "arrived";
    this.ref.current.remove(); // remove from map
  }
}
