import React from "react";
import styles from "./styles.module.css";
import { moveTo } from "./move.js";

export default class Passenger{
    constructor(props) {
        this.state = 'waiting';
        this.currentLocation = props.currentLocation;
        this.destination = props.destination;
        this.waitingTime = 0;
        this.driver = null;
        this.ref = props.ref;

        this.appearTime = Date.now() / 1000 | 0;
        console.log(`Passenger appear at ${this.appearTime}`)
    }    

    // do we need a state for car not arrived yet?
    
    carArrived(timestamp, driver){ 
        this.driver = driver;
        this.state = 'transit';
        if (this.driver.currentLocation == this.currentLocation){
            this.waitingTime = timestamp - this.appearTime;
            console.log(`Passenger waiting time: ${this.waitingTime}`)
            this.state = 'transit';
        }
        console.log('here', this)
    }
    transit(){
        // this.currentLocation = this.driver.currentLocation; //FIXME: update the current location of the passenger while transiting (same as grab's location)
        console.log(`passenger current location when transit: ${this.currentLocation}`)
        if (this.currentLocation == this.destination){
            this.state = 'arrived';
        }
        // console.log('passenger', this.state)
        console.log(this.ref.current)
        console.log('speed', this.driver.speed)
        moveTo(this.ref.current, this.currentLocation, this.destination, this.ref, this.driver.speed)
    }
    arrived(){
        this.state = 'arrived';
        // this.removePassenger(); //FIXME: remove passenger from the screen
    }

    test(){
        while (true){ //FIXME:
            switch (this.state){
                case 'waiting':
                    console.log("Car arrived");
                    this.carArrived(Date.now() / 1000 | 0);
                    break;
                case 'transit':
                    console.log('Transiting')
                    this.transit();
                    break;
                case 'arrived':
                    console.log('Arrived')
                    break
            }
            if (this.state == 'arrived'){
                console.log('Disappearing')
                console.log(`Total waiting time: ${this.waitingTime}`)
                break;
            }
        }
    }
    
    // render() {
    //     return (
    //       <div>
    //         <div className={styles.passenger}></div>
    //       </div>
    //     );
    // }
}
