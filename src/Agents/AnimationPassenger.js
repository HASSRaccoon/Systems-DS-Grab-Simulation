import React from "react";
import styles from "./styles.module.css";
import { moveTo } from "./move.js";

export default class AnimationPassenger {
  constructor(props) {
    this.id = props.id;
    this.state = "waiting";
    this.currentLocation = props.currentLocation;
    this.destination = props.destination;
    this.waitingTime = 0;
    this.driver = null;
    this.ref = props.ref;
    this.cancelTendency = props.cancelTendency;
    this.counter = 0;
    this.agentType = "passenger";

    this.appearTime = (Date.now() / 1000) | 0;
    // console.log(`Passenger appear at ${this.appearTime}`);
  }

  wait() {
    console.log("wait");
  }
  // carArrived(timestamp, driver){
  //     this.driver = driver;
  //     this.state = 'transit';
  //     if (this.driver.currentLocation == this.currentLocation){
  //         this.waitingTime = timestamp - this.appearTime;
  //         console.log(`Passenger waiting time: ${this.waitingTime}`)
  //         this.state = 'transit';
  //     }
  // }
  carArrived(timestamp) {
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
    moveTo(this.ref.current, this.currentLocation, this.destination, this.ref);
  }
  arrived() {
    this.state = "arrived";
    this.ref.current.remove(); // remove from map
  }
  cancel() {
    console.log("passenger cancelled");
    // this.driver.passenger = null;
    this.ref.current.remove(); // remove from map
  }
}
