import React from "react";
import styles from "./styles.module.css";
import moveTo from "./move.js";

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
    }
    search(driver, passenger){
        console.log('Search')
        console.log(passenger)
        if (this.passenger){ 
            this.destination = this.passenger.state.currentLocation;
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
        // this.destination = this.passenger.state.currentLocation;
        if (this.currentLocation <= this.destination - this.speed){
            this.currentLocation[0] += this.speed[0];
            this.currentLocation[1] += this.speed[1];
            console.log(`driver current location when picking up: ${this.currentLocation}`)
        }
        else{ //FIXME:
            this.state = 'transit';
        }
    }
    transit(){
        console.log('transit')
        // console.log('stop')
        console.log(this.state)
        this.destination = this.passenger.state.destination;
        if (this.currentLocation < this.destination - this.speed){
            this.currentLocation[0] += this.speed[0];
            this.currentLocation[1] += this.speed[1];
            console.log(`driver current location when transit: ${this.currentLocation}`)
        }
        else{
            this.state = 'completed';
        }
    }
    completed(){
        console.log('completed')
        this.passenger = null;
        this.currentLocation = this.destination;
        this.destination = null;
        this.state = 'searching';
        console.log(this.state)
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
    // render() {
    //     return (
    //       <div>
    //         <div className={styles.driver}></div>
    //         {/* <button type="button" onClick={this.changeLocation}>Change location</button> */}
    //         <button type="button" onClick={this.show}>Show</button>
    //         <button onClick={this.search}>Search</button>
    //         <div>{this.currentLocation[0]}</div>
    //         <div>{this.currentLocation[1]}</div>
    //       </div>
    //     );
    //   }
}