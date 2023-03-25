import React from "react";
import styles from "./styles.module.css";
import { moveTo } from "./move.js";

export default class Driver {
    constructor(props) {
        this.state = 'searching';
        this.currentLocation = props.currentLocation;
        this.destination = null;
        this.waitingTime = 0;
        this.speed = props.speed;
        this.distanceWillingToTravel = 0;
        this.completedJobs = 0;
        this.passenger = props.passenger;
        this.earnings = 0;
        this.rating = 0;
        this.ref = props.ref;
    }
    search(passenger){
        console.log('Search')
        if (this.passenger){ 
            this.destination = this.passenger.currentLocation;
            this.state = 'picking up';
        }
        else{
            console.log('no passenger')
            this.passenger = passenger;
            this.currentLocation[0] += this.speed[0];
            this.currentLocation[1] += this.speed[1];
            this.waitingTime += 1; //FIXME: need to add the correct timestamp
        }
    }
    pickUp(){
        if (this.currentLocation <= this.destination - this.speed){
            this.currentLocation[0] += this.speed[0];
            this.currentLocation[1] += this.speed[1];
            console.log(`driver current location when picking up: ${this.currentLocation}`)
        }
        else{ //FIXME:
            this.state = 'transit';
        }
        moveTo(this.ref.current, this.currentLocation, this.destination, this.ref, this.speed)
        // this.passenger.carArrived(Date.now() / 1000 | 0, this);
    }
    transit(){
        console.log('transit')
        this.destination = this.passenger.destination;
        if (this.currentLocation < this.destination - this.speed){
            this.currentLocation[0] += this.speed[0];
            this.currentLocation[1] += this.speed[1];
            console.log(`driver current location when transit: ${this.currentLocation}`)
        }
        else{
            this.state = 'completed';
        }
        console.log(this.ref)
        moveTo(this.ref.current, this.currentLocation, this.destination, this.ref, this.speed)
    }
    completed(){
        console.log('completed')
        this.passenger = null;
        this.destination = [200,200];
        this.state = 'searching';
        console.log(this.state)
        moveTo(this.ref.current, this.currentLocation, this.destination, this.ref, this.speed)
    }

    test(){
        while (this.passenger > 0){ //FIXME:
            switch (this.state){
                case 'searching':
                    console.log("Searching")
                    this.search();
                    break;
                case 'picking up':
                    console.log('picking up')
                    this.pickUp(this.passengerLocation[this.passengers - 1]);
                    break;
                case 'transit':
                    console.log('Transiting')
                    this.transit(this.passengerDestination[this.passengers - 1]);
                    break
                case 'completed':
                    this.completed();
                    break
            }
        }
    }

    changeLocation = () => {
        this.setState({currentLocation: [this.currentLocation[0] + this.speed[0],this.currentLocation[1] + this.speed[1]]});
      }
    show = () => {
        console.log(this.state)
    }
}