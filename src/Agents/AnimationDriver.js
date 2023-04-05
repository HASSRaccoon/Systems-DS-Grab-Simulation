import React from "react";
import styles from "./styles.module.css";
import { moveTo } from "./move.js";

export default class AnimationDriver {
  constructor(props) {
    //// Global affecting ////
    this.speed = props.speed;
    /////////////////////////
    this.timeCounter = 0;
    this.id = props.id;
    this.state = "searching";
    this.currentLocation = props.currentLocation;
    this.destination = props.destination;
    this.waitingTime = 0;

    this.distanceWillingToTravel = props.distanceWillingToTravel;
    this.completedJobs = 0;
    this.cancelledJobs = 0;
    this.passenger = props.passenger;
    this.earnings = 0;
    this.rating = 0;
    this.ref = props.ref;
    this.path = 0;
    this.counter = 0;
    this.workingPeriod = []; //nested list
    this.isWorking = true;
    this.currentLeftoverDist = 0;
    this.currentSteps = 0;
    this.currentLeftoverTime = 0;
    this.distancePerStep = 0;
    this.Log = {
      //for reference
      // 0: {
      //   searching: {distance: 0 , fuelcost: 0,  duration: 0, timeFound: 0},
      //   pickingup: {distance: 0 , fuelcost: 0,  duration: 0},
      //   transit: {distance: 0 , fuelcost: 0,  duration: 0, earning: 0},
      // },
      // 1: {
      //   searching: {distance: 0 , fuel: 0,  duration: 0, timeFound: 0},
      //   pickingup: {distance: 0 , fuel: 0,  duration: 0},
      //   transit: {distance: 0 , fuel: 0,  duration: 0, earning: 0},
      // },
    };
    this.timeLog = {};
    this.totalTime = 0;
    this.totalTicks = 0;
    this.totaldistSearch = 0;
    this.totaldistPickup = 0;
    this.totaldistTransit = 0;
    this.totalDistanceTravelled = 0;
    this.agentType = "driver";
    //// Global affecting ////
    this.speed = props.speed;
    /////////////////////////
    this.moveTendency = props.moveTendency;
    // add a parameter to change how the driver slows down when raining?? //TODO:
  }
  updateSpeed(raining) {
    if (raining) {
      this.speed[0] *= 0.8; //TODO: change to parameter
      this.speed[1] *= 0.8;
    } else {
      this.speed[0] /= 0.8;
      this.speed[1] /= 0.8;
    }
  }
  //   search(passenger) {
  //     if (this.passenger) {
  //       // console.log('picking up')
  //       this.destination = this.passenger.currentLocation;
  //       console.log(`driver destination after searching: ${this.destination}`);
  //       this.state = "picking up";
  //     } else {
  //       // console.log('searching')
  //       // this.currentLocation[0] += this.speed[0];
  //       // this.currentLocation[1] += this.speed[1];
  //       this.waitingTime += 1; //FIXME: need to add the correct timestamp
  //       console.log(
  //         `current: ${this.currentLocation}, dest: ${this.destination}`
  //       );
  //       let random = Math.random();
  //       console.log(random);
  //       if (random < this.moveTendency) {
  //         this.destination = [Math.random() * 200, Math.random() * 200];
  //         moveTo(
  //           this.ref.current,
  //           this.currentLocation,
  //           this.destination,
  //           this.ref,
  //           this.speed
  //         );
  //       }
  //       this.passenger = passenger;
  //     }
  //   }
  search(passenger) {
    // if (this.passenger === null && this.state === "searching") {
    // }
    // console.log("the passenger this driver received is: " + passenger.id);
    // console.log(
    //   "the passenger this driver registered within constructor is: " +
    //     this.passenger.id
    // );
    if (this.passenger) {
      // console.log('picking up')
      this.destination = this.passenger.currentLocation;
      this.state = "picking up";
      // console.log(
      //   "from Driver class, Driver " +
      //     this.id +
      //     " has been appointed passenger" +
      //     this.passenger.id +
      //     " thus moving into the picking up state. Checking state: " +
      //     this.state +
      //     " and going to passenger current location now: " +
      //     this.destination
      // );
    } else {
      // console.log('searching')
      // this.passenger = passenger;
      // this.currentLocation[0] += this.speed[0];
      // this.currentLocation[1] += this.speed[1];
      // this.waitingTime += 1; //FIXME: need to add the correct timestamp
    }
  }
  pickUp() {
    this.destination = this.passenger.destination;
    // if (this.currentLocation <= this.destination - this.speed) {
    //   this.currentLocation[0] += this.speed[0];
    //   this.currentLocation[1] += this.speed[1];
    //   // console.log(`driver current location when picking up: ${this.currentLocation}`)
    // } else {
    //   //FIXME:
    //   this.state = "transit";
    // }
    // moveTo(
    //   this.ref.current,
    //   this.currentLocation,
    //   this.destination,
    //   this.ref,
    //   this.speed
    // );
    // this.passenger.carArrived(Date.now() / 1000 | 0, this);
    this.state = "transit";
    // console.log(
    //   "from Driver class, Driver " +
    //     this.id +
    //     " has reached this passenger: " +
    //     this.passenger.id +
    //     " thus moving into the transit state. Checking state: " +
    //     this.state +
    //     " and going to passenger destination now: " +
    //     this.destination
    // );
  }
  //   pickUp() {
  //     if (this.currentLocation <= this.destination - this.speed) {
  //       // this.currentLocation[0] += this.speed[0];
  //       // this.currentLocation[1] += this.speed[1];
  //       // console.log(`driver current location when picking up: ${this.currentLocation}`)
  //     } else {
  //       //FIXME:
  //       this.state = "transit";
  //     }
  //     moveTo(
  //       this.ref.current,
  //       this.currentLocation,
  //       this.destination,
  //       this.ref,
  //       this.speed
  //     );
  //     // this.passenger.carArrived(Date.now() / 1000 | 0, this);
  //   }
  transit() {
    // this.destination = this.passenger.destination;
    // if (this.currentLocation < this.destination - this.speed) {
    //   this.currentLocation[0] += this.speed[0];
    //   this.currentLocation[1] += this.speed[1];
    //   console.log(
    //     `driver current location when transit: ${this.currentLocation}`
    //   );
    // } else {
    //   this.state = "completed";
    // }
    // moveTo(
    //   this.ref.current,
    //   this.currentLocation,
    //   this.destination,
    //   this.ref,
    //   this.speed
    // );
    // driver current Location == driver destination
    this.state = "completed"; // eugene: abit sus, might have been neglected for awhile, decide if need to change
    console.log(
      "from Driver class, Driver " +
        this.id +
        " is going on a trip with passenger " +
        this.passenger.id +
        "'s journey, waiting to mark complete trip... Checking state: " +
        this.state +
        " but currently still holding this destination: " +
        this.destination
    );
  }
  //   transit() {
  //     this.destination = this.passenger.destination;
  //     console.log(`driver destination after transit: ${this.destination}`);
  //     if (this.currentLocation < this.destination - this.speed) {
  //       // this.currentLocation[0] += this.speed[0];
  //       // this.currentLocation[1] += this.speed[1];
  //       console.log(
  //         `driver current location when transit: ${this.currentLocation}`
  //       );
  //     } else {
  //       this.state = "completed";
  //     }
  //     moveTo(
  //       this.ref.current,
  //       this.currentLocation,
  //       this.destination,
  //       this.ref,
  //       this.speed
  //     );
  //   }

  completed() {
    console.log(
      "from Driver class, Driver " +
        this.id +
        " has completed this " +
        this.passenger.id +
        "'s journey, thus demarcated as completed state. Checking state: " +
        this.state +
        " but currently still holding this destination: " +
        this.destination
    );
    this.state = "searching";
    console.log(
      "was in the completed state, already changed state to searching. Checking state: " +
        this.state
    );
    this.completedJobs += 1;
    this.passenger = null;
  }

  changeLocation = () => {
    this.setState({
      currentLocation: [
        this.currentLocation[0] + this.speed[0],
        this.currentLocation[1] + this.speed[1],
      ],
    });
  };
}
