import sgJSON from "./road-network.json";

export default class Driver {
    constructor(props) {
        //// Global affecting ////
        this.speed = props.speed;
        /////////////////////////

        this.id = props.id;
        this.state = 'searching';
        this.searchingRadius = 0;
        this.currentLocation = this.generateRandomCoord();
        this.destination = null;
        this.time = 0;
        this.completedJobs = 0;
        this.cancelledJobs = 0;
        this.passenger = props.passenger;


        this.framesToMove = props.framesToMove;
        this.moveTendency = props.moveTendency; //likelihood of travelling in search of passenger

        this.log = {};
        this.jobLog = {};
        this.distance = 0;
        this.distanceToTravel = 0;

        //// TIME AFFECTING //// 
        this.startTime = props.startTime;
        this.endTime = props.endTime;
        this.breakStart = props.breakStart;
        this.breakEnd = props.breakEnd;
        

        this.path = null;
        this.speedLs = [];

        this.initialLocation = this.currentLocation; //NOTE: for logging start location at start of each state
        this.endLocation = null; //NOTE: for logging end location at end of each state
        this.searchLocation = this.currentLocation

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

        
            if (this.destination !== null){
                this.endLocation = this.destination;
            }
            else{
                this.endLocation = this.currentLocation;
            }
            
            this.jobLog['searching'] = {
                'start location': this.initialLocation,
                'end location': this.endLocation,
                'time spent': this.time, 
                'distance': this.distance, 
                'current time': ticks, 
                'speed': this.speedLs,
                'fuelcost': fuelCost,
                'radius': this.radius
            } //NOTE: log here

            //NOTE: clear logged data
            this.distance = 0
            this.time = 0
            this.speedLs = [];

            this.destination = this.passenger.currentLocation;

            this.initialLocation = this.passenger.currentLocation
            this.endLocation = null
            this.state = 'picking up';

        }
        else{
            this.time += 1; //NOTE: time is in tick, waiting time of searching passenger
            let moveRandom = Math.random();
            if (this.time > this.framesToMove && moveRandom < this.moveTendency) {
                this.destination = this.generateRandomCoord();
                this.endLocation = this.destination;

                let speed = this.distancePerTick(this.speed);
                this.speedLs.push(speed);
                this.distance += speed;
            }
            // else{
                //     this.destination = this.currentLocation;
                // }
                
            this.passenger = passenger;
        }
    }
    pickUp(ticks,globals){
        // console.log(this.id, ' pick up distance', this.distance, 'pick up to travel', this.distanceToTravel)
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
            
            this.endLocation = this.passenger.currentLocation

            this.jobLog['pick up'] = {
                'start location': this.initialLocation,
                'end location': this.endLocation,
                'time spent': this.time, 
                'distance': this.distance, 
                'current time': ticks, 
                'speed': this.speedLs, 
                'fuelcost':fuelCost
            } //NOTE: log here

            //NOTE: clear logged data
            this.distance = 0
            this.time = 0

            this.initialLocation = this.endLocation
            this.endLocation = null

            this.state = 'transit';
            this.destination = this.passenger.destination;
            this.speedLs = [];
        }
    }
    transit(ticks,globals){
        // console.log(this.id, ' transit distance', this.distance, 'transit to travel', this.distanceToTravel)
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

            this.endLocation = this.destination

            this.jobLog['transit'] = {
                'start location': this.initialLocation,
                'end location': this.endLocation,
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

            this.initialLocation = this.endLocation

            this.state = 'completed';
            this.currentLocation = this.endLocation;
        }
    }
    completed(globals){
        let profits = globals.profitCalculation(this.tripFare,this.tripFuelCost);

        this.jobLog['totals'] = {
            'start location': this.searchLocation,
            'end location': this.endLocation,
            'time spent': this.tripTime, 
            'distance': this.tripDistance, 
            'fuelcost': this.tripFuelCost,
            'fare': this.tripFare,
            'profit': profits
        }

        this.state = 'searching';
        this.completedJobs += 1;
        this.passenger = null;
        this.destination = null;

        this.searchLocation = this.currentLocation;
        
        this.endLocation = null
        this.speedLs = [];
        this.resetTripVariables();
        
        this.log[`${this.completedJobs}`] = {...this.jobLog}
        console.log(`${this.id}'s log`)
        console.log(this.log)
    }

    distancePerTick(speed){
        return speed / 60;
    }

    generateRandomCoord() {
        let featureIndex = Math.floor(Math.random() * sgJSON.features.length)
        let coordinateIndex = Math.floor(Math.random() * sgJSON.features[featureIndex].geometry.coordinates.length)

        let Pos =
          sgJSON.features[featureIndex]
            .geometry.coordinates[coordinateIndex];
        return Pos;
    }

    resetTripVariables(){
        this.tripDistance = 0;
        this.tripTime = 0;
        this.tripFuelCost = 0;
        this.tripFare = 0;
    }
}