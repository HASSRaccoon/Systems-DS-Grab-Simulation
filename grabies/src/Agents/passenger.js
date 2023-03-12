import React from "react";
import styles from "./styles.module.css";

export default class Passenger extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            state: 'waiting',
            currentLocation: props.location,
            destination: props.destination,
            waitingTime: 0,
            driver: null,
        }
        // this.location = location;
        // this.currentLocation = location;
        // this.destination = destination;
        // this.waitingTime = 0;
        // this.driver = null;

        this.appearTime = Date.now() / 1000 | 0;
        console.log(`Passenger appear at ${this.appearTime}`)
    }    

    // do we need a state for car not arrived yet?
    
    carArrived(timestamp, driver){ 
        this.driver = driver;
        if (this.driver.currentLocation == this.location){
            this.waitingTime = timestamp - this.appearTime;
            console.log(`Passenger waiting time: ${this.waitingTime}`)
            this.state = 'transit';
        }
    }
    transit(){
        this.currentLocation = this.driver.currentLocation; //FIXME: update the current location of the passenger while transiting (same as grab's location)
        console.log(`passenger current location when transit: ${this.currentLocation}`)
        if (this.currentLocation == this.destination){
            this.state = 'arrived';
        }
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
    
    render() {
        return (
          <div>
            <div className={styles.passenger}></div>
          </div>
        );
    }
}
