import sgJSON from "./road-network.json";
import * as turf from "@turf/turf";
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";

export default class Driver {
    constructor(props) {
        //// Global affecting ////
        this.speed = props.speed;
        /////////////////////////

        this.id = props.id;
        this.state = 'searching';
        this.currentLocation = this.generateRandomCoord();
        this.destination = null;
        this.time = 0;
        this.distanceWillingToTravel = 0;
        this.completedJobs = 0;
        this.cancelledJobs = 0;
        this.passenger = props.passenger;
        this.earnings = 0;
        this.rating = 0;
        this.ref = props.ref;
        this.moveTendency = props.moveTendency;
        this.log = {};
        this.jobLog = {};
        this.distance = 0;
        this.distanceToTravel = 0;
        this.startTime = 420; //NOTE: 7am
        this.endTime = 1020; //NOTE: 5pm
        this.path = null;
    }
    updateSpeed(raining) {
        if (raining) {
            this.speed *= 0.8; //TODO: change to parameter
        }
        else {
            this.speed /= 0.8;
        }
    }
    search(passenger){
        if (this.passenger){ 
            this.jobLog['searching'] = {'time spent': this.time, 'distance': this.distance} //NOTE: log here
            //NOTE: clear logged data
            this.distance = 0
            this.time = 0

            this.destination = this.passenger.currentLocation;
            this.state = 'picking up';
        }
        else{
            this.time += 1; //NOTE: time is in tick, waiting time of searching passenger
            let random = Math.random();
            if (random < this.moveTendency) {
                this.destination = this.generateRandomCoord();
            }
            this.distance += this.distancePerTick(this.speed);
            this.passenger = passenger;
        }
    }
    pickUp(){
        console.log(this.id, 'pick up distance', this.distance, 'pick up to travel', this.distanceToTravel)
        let speed = this.distancePerTick(this.speed);
        this.time += Math.min(1, this.distanceToTravel / speed); //NOTE: time is in tick, time spent to travel to passenger location
        if (Math.floor(this.distanceToTravel / speed) != 0){ //NOTE: like 4km -> 2.66km etc (no remainder)
            this.distance += speed
            this.distanceToTravel -= speed
        }
        else{
            //NOTE: add the remainder
            this.distance += this.distanceToTravel; //DEBUG: need to check is this correct
            this.distanceToTravel = 0;
            this.jobLog['pick up'] = {'time spent': this.time, 'distance': this.distance} //NOTE: log here
            //NOTE: clear logged data
            this.distance = 0
            this.time = 0
            this.state = 'transit';
            this.destination = this.passenger.destination;
        }
    }
    transit(){
        console.log('transit distance', this.distance, 'transit to travel', this.distanceToTravel)
        let speed = this.distancePerTick(this.speed);
        this.time += Math.min(1, this.distanceToTravel / speed); //NOTE: time is in tick, time spent to travel to passenger location
        if (Math.floor(this.distanceToTravel / speed) != 0){ //NOTE: like 4km -> 2.66km etc (no remainder)
            this.distance += speed
            this.distanceToTravel -= speed
        }
        else{
            //NOTE: add the remainder
            this.distance += this.distanceToTravel; //DEBUG: need to check is this correct
            this.distanceToTravel = 0;
            this.jobLog['transit'] = {'time spent': this.time, 'distance': this.distance} //NOTE: log here
            this.state = 'completed';
            this.destination = this.passenger.destination;
        }
    }
    completed(){
        this.state = 'searching';
        this.completedJobs += 1;
        this.passenger = null;
        // NOTE: clear logged data
        this.distance = 0
        this.time = 0
        this.log[`${this.completedJobs}`] = {...this.jobLog}
        console.log(`${this.id}'s log`)
        console.log(this.log)
    }

    buildPath(start, end) {
        const pathBuilder = new PathFinder(sgJSON, { tolerance: 1e-4 });
        const path = pathToGeoJSON(
          pathBuilder.findPath(turf.point(start), turf.point(end))
        );
        return path;
    }

    distanceCalculation(location, destination){
        let path = this.buildPath(location, destination);
        return turf.length(path)
    }

    distancePerTick(speed){
        return speed / 60;
    }

    generateRandomCoord() {
        let Pos =
          sgJSON.features[Math.floor(Math.random() * sgJSON.features.length)]
            .geometry.coordinates[0];
        return Pos;
    }
}