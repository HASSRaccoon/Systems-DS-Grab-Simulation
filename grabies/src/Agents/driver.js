import React from "react";
import styles from "./styles.module.css";
import moveTo from "./move.js";

export default class Driver extends React.Component {
    constructor(props) {
        super(props);
        console.log('props')
        console.log(props)
        this.state = {
            state: 'searching',
            currentLocation: props.currentLocation,
            destination: null,
            waitingTime: 0,
            speed: props.speed,
            distanceWillingToTravel: 0,
            completedJobs: 0,
            passenger: props.passenger,
            earnings: 0,
            // rating: 0,
        };

        if (this.state.start){
            switch (this.state.state){
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


        // this.location = location;
        // this.currentLocation = location;
        // this.destination = null;
        // this.waitingTime = 0;
        // this.speed = speed;
        // this.distanceWillingToTravel = 0;
        // this.completedJobs = 0;

        // this.passenger = null;

        // // dumping some other (maybe stupid) attributes
        // this.earnings = 0;
        // this.rating = 0;
        // // this.raining = false;
        // // this.traffic = false;
        // // this.emotion = 'angry';
        // // if (this.emotion == 'angry'){
        // //     this.speed = 5;
        // //     Passenger.emotion = 'scared';
        // // }
        // console.log(this.state)
    }
    search(driver, passenger){
        if (this.state.passenger){ 
            console.log('debug')
            this.state.state = 'picking up';
            console.log(this.state)
        }
        else{
            this.state.passenger = passenger;
            this.state.currentLocation += this.state.speed;
            this.waitingTime += 1; //FIXME: need to add the correct timestamp
            console.log('debug1')
            console.log(this.state)
        }
    }
    pickUp(){
        this.destination = this.passenger.location;
        if (this.currentLocation != this.destination){
            this.currentLocation += this.speed;
            console.log(`driver current location when picking up: ${this.currentLocation}`)
        }
        else{ //FIXME:
            this.state = 'transit';
        }
    }
    transit(){
        this.destination = this.passenger.destination;
        if (this.currentLocation != this.destination){
            this.currentLocation += this.speed;
            console.log(`driver current location when transit: ${this.currentLocation}`)
        }
        else{
            this.state = 'completed';
        }
    }
    completed(){
        this.state = 'searching';
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
        this.setState({currentLocation: [this.state.currentLocation[0] + this.state.speed[0],this.state.currentLocation[1] + this.state.speed[1]]});
      }
    show = () => {
        console.log(this.state)
    }
    render() {
        return (
          <div>
            <div className={styles.driver}></div>
            {/* <button type="button" onClick={this.changeLocation}>Change location</button> */}
            <button type="button" onClick={this.show}>Show</button>
            <button onClick={this.search}>Search</button>
            <div>{this.state.currentLocation[0]}</div>
            <div>{this.state.currentLocation[1]}</div>
          </div>
        );
      }
}