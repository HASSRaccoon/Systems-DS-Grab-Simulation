import React from "react";
import styles from "./styles.module.css";
import { moveTo } from "./move.js";

export default class Driver {
    constructor(props) {
        //// Global affecting ////
        this.speed = props.speed;
        /////////////////////////

        this.id = props.id;
        this.state = 'searching';
        this.currentLocation = props.currentLocation;
        this.destination = null;
        this.waitingTime = 0;
        this.distanceWillingToTravel = 0;
        this.completedJobs = 0;
        this.cancelledJobs = 0;
        this.passenger = props.passenger;
        this.earnings = 0;
        this.rating = 0;
        this.ref = props.ref;
        this.moveTendency = props.moveTendency;
        this.log = {}
        // add a parameter to change how the driver slows down when raining?? //TODO:
    }
    updateSpeed(raining) {
        if (raining) {
            this.speed[0] *= 0.8; //TODO: change to parameter
            this.speed[1] *= 0.8;
        }
        else {
            this.speed[0] /= 0.8;
            this.speed[1] /= 0.8;
        }
    }
    search(passenger){
        if (this.passenger){ 
            // console.log('picking up')
            this.destination = this.passenger.currentLocation;
            console.log(`driver destination after searching: ${this.destination}`)
            this.state = 'picking up';
        }
        else{
            // console.log('searching')
            // this.currentLocation[0] += this.speed[0];
            // this.currentLocation[1] += this.speed[1];
            this.waitingTime += 1; //FIXME: need to add the correct timestamp
            console.log(`current: ${this.currentLocation}, dest: ${this.destination}`)
            let random = Math.random();
            console.log(random)
            if (random < this.moveTendency) {
                this.destination = [Math.random()*200,Math.random()*200];
                moveTo(this.ref.current, this.currentLocation, this.destination, this.ref, this.speed)
            }
            this.passenger = passenger;
        }
    }
    pickUp(){
        if (this.currentLocation <= this.destination - this.speed){
            // this.currentLocation[0] += this.speed[0];
            // this.currentLocation[1] += this.speed[1];
            // console.log(`driver current location when picking up: ${this.currentLocation}`)
        }
        else{ //FIXME:
            this.state = 'transit';
        }
        moveTo(this.ref.current, this.currentLocation, this.destination, this.ref, this.speed)
        // this.passenger.carArrived(Date.now() / 1000 | 0, this);
    }
    transit(){
        this.destination = this.passenger.destination;
        console.log(`driver destination after transit: ${this.destination}`)
        if (this.currentLocation < this.destination - this.speed){
            // this.currentLocation[0] += this.speed[0];
            // this.currentLocation[1] += this.speed[1];
            console.log(`driver current location when transit: ${this.currentLocation}`)
        }
        else{
            this.state = 'completed';
        }
        moveTo(this.ref.current, this.currentLocation, this.destination, this.ref, this.speed)
    }
    completed(){
        console.log('completed')
        this.state = 'searching';
        this.completedJobs += 1;
        this.passenger = null;
        // this.destination = [Math.random()*200,Math.random()*200];

        moveTo(this.ref.current, this.currentLocation, this.destination, this.ref, this.speed)
    }

    changeLocation = () => {
        this.setState({currentLocation: [this.currentLocation[0] + this.speed[0],this.currentLocation[1] + this.speed[1]]});
    }
}