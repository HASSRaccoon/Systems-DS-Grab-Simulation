import sgJSON from "./road-network.json";

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
        this.completedJobs = 0;
        this.cancelledJobs = 0;
        this.passenger = props.passenger;
        this.moveTendency = props.moveTendency;
        this.log = {};
        this.jobLog = {};
        this.distance = 0;
        this.distanceToTravel = 0;
        this.startTime = 1020; //NOTE: 5pm
        this.endTime = 240; //NOTE: 4am
        this.breakStart = 0; //NOTE: 12am
        this.breakEnd = 60; //NOTE: 1am
        this.path = null;
        this.speedLs = [];
        this.timeFlag = 0;

        this.tripDistance = 0;
        this.tripTime = 0;
        this.tripFuelCost = 0;
        this.tripFare = 0;
        
    }
    updateSpeed(raining) {
        if (raining) {
            // this.speed *= 0.8; //TODO: change to parameter
            this.speed *= 0.84; //reduce by 16% if raining
        }
        else {
            // this.speed /= 0.8;
            this.speed /= 0.84;//revert to normal speed if not raining
        }
    }
    search(passenger, ticks, globals){
        if (this.passenger){ 
            let fuelCost = globals.fuelcostCalculation(this.distance)
            this.tripFuelCost += fuelCost;
            this.tripDistance += this.distance;
            this.tripTime += this.time;

            this.jobLog['searching'] = {
                'time spent': this.time, 
                'distance': this.distance, 
                'current time': ticks, 
                'speed': this.speedLs,
                'fuelcost': fuelCost
            } //NOTE: log here

            //NOTE: clear logged data
            this.distance = 0
            this.time = 0
            this.speedLs = [];

            this.destination = this.passenger.currentLocation;
            this.state = 'picking up';
        }
        else{
            this.time += 1; //NOTE: time is in tick, waiting time of searching passenger
            let moveRandom = Math.random();
            if (this.time > this.moveTendency && moveRandom > 0.8) {
                this.destination = this.generateRandomCoord();
            }
            else{
                this.destination = this.currentLocation;
            }
            let speed = this.distancePerTick(this.speed);
            this.speedLs.push(speed);
            this.distance += speed;
            this.passenger = passenger;
        }
    }
    pickUp(ticks,globals){
        console.log(this.id, 'pick up distance', this.distance, 'pick up to travel', this.distanceToTravel)
        let speed = this.distancePerTick(this.speed);
        this.speedLs.push(speed);
        this.time += Math.min(1, this.distanceToTravel / speed); //NOTE: time is in tick, time spent to travel to passenger location
        if (Math.floor(this.distanceToTravel / speed) !== 0){ //NOTE: like 4km -> 2.66km etc (no remainder)
            this.distance += speed
            this.distanceToTravel -= speed
        }
        else{
            //NOTE: add the remainder
            this.distance += this.distanceToTravel;
            this.distanceToTravel = 0;
            
            this.timeFlag = ticks; //NOTE: time flag to check if it is peak hour on pickup
            let fuelCost = globals.fuelcostCalculation(this.distance)
            this.tripFuelCost += fuelCost;
            this.tripDistance += this.distance;
            this.tripTime += this.time;

            this.jobLog['pick up'] = {
                'time spent': this.time, 
                'distance': this.distance, 
                'current time': ticks, 
                'speed': this.speedLs, 
                'fuelcost':fuelCost
            } //NOTE: log here

            //NOTE: clear logged data
            this.distance = 0
            this.time = 0
            this.state = 'transit';
            this.destination = this.passenger.destination;
        }
    }
    transit(ticks,globals){
        console.log('transit distance', this.distance, 'transit to travel', this.distanceToTravel)
        let speed = this.distancePerTick(this.speed);
        this.speedLs.push(speed);
        this.time += Math.min(1, this.distanceToTravel / speed); //NOTE: time is in tick, time spent to travel to passenger location
        if (Math.floor(this.distanceToTravel / speed) !== 0){ //NOTE: like 4km -> 2.66km etc (no remainder)
            this.distance += speed
            this.distanceToTravel -= speed
        }
        else{
            //NOTE: add the remainder
            this.distance += this.distanceToTravel;
            this.distanceToTravel = 0;

            let fare = globals.fareCalculation(this.distance, this.time, this.timeFlag)
            this.tripFare = fare;
            let fuelCost = globals.fuelcostCalculation(this.distance)
            this.tripFuelCost += fuelCost;
            this.tripDistance += this.distance;
            this.tripTime += this.time;

            this.jobLog['transit'] = {
                'time spent': this.time, 
                'distance': this.distance, 
                'current time': ticks, 
                'speed': this.speedLs, 
                'fuelcost': fuelCost,
                'fare': fare
            } //NOTE: log here

            // NOTE: clear logged data
            this.distance = 0;
            this.time = 0;
            this.speedLs = [];
            this.state = 'completed';
            this.currentLocation = this.destination;
        }
    }
    completed(globals){
        let profits = globals.profitCalculation(this.tripFare,this.tripFuelCost);

        this.jobLog['totals'] = {
            'time spent': this.tripTime, 
            'distance': this.tripDistance, 
            'fuelcost': this.tripFuelCost,
            'fare': this.tripFare,
            'profit': profits
        }

        this.state = 'searching';
        this.completedJobs += 1;
        this.passenger = null;
        this.resetTripVariables();
        
        this.log[`${this.completedJobs}`] = {...this.jobLog}
        console.log(`${this.id}'s log`)
        console.log(this.log)
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

    resetTripVariables(){
        this.tripDistance = 0;
        this.tripTime = 0;
        this.tripFuelCost = 0;
        this.tripFare = 0;
    }
}