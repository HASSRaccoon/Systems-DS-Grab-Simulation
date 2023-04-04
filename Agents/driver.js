export default class Driver {
    constructor(props) {
        //// Global affecting ////
        this.speed = props.speed;
        /////////////////////////

        this.id = props.id;
        this.state = 'searching';
        this.currentLocation = props.currentLocation;
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
            this.distanceToTravel = this.distanceCalculation(this.currentLocation, this.destination);
            this.state = 'picking up';
        }
        else{
            this.time += 1; //NOTE: time is in tick, waiting time of searching passenger
            let random = Math.random();
            if (random < this.moveTendency) {
                this.destination = [Math.random()*200,Math.random()*200]; //FIXME: feels like sth wrong here
            }
            this.distance += this.distancePerTick(this.speed);
            this.passenger = passenger;
        }
    }
    pickUp(){
        this.time += 1; //NOTE: time is in tick, time spent to travel to passenger location
        let speed = this.distancePerTick(this.speed);
        if (Math.floor(this.distanceToTravel / speed) != 0){ //NOTE: like 4km -> 2.66km etc (no remainder)
            this.distance += speed
            this.distanceToTravel -= speed
        }
        else{
            //NOTE: add the remainder
            this.distance += this.distanceToTravel; //DEBUG: need to check is this correct
            this.jobLog['pick up'] = {'time spent': this.time, 'distance': this.distance} //NOTE: log here
            //NOTE: clear logged data
            this.distance = 0
            this.time = 0
            this.state = 'transit';
            this.destination = this.passenger.destination;
            this.distanceToTravel = this.distanceCalculation(this.currentLocation, this.destination);
        }
    }
    transit(){
        this.time += 1; //NOTE: time is in tick, time spent to travel to passenger location
        let speed = this.distancePerTick(this.speed);
        if (Math.floor(this.distanceToTravel / speed) != 0){ //NOTE: like 4km -> 2.66km etc (no remainder)
            this.distance += speed
            this.distanceToTravel -= speed
        }
        else{
            //NOTE: add the remainder
            this.distance += this.distanceToTravel; //DEBUG: need to check is this correct
            this.jobLog['transit'] = {'time spent': this.time, 'distance': this.distance} //NOTE: log here
            this.state = 'completed';
            this.destination = this.passenger.destination;
            this.distanceToTravel = this.distanceCalculation(this.currentLocation, this.destination);
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

    distanceCalculation(location, destination){
        return Math.sqrt(Math.pow(location[0] - destination[0], 2) + Math.pow(location[1] - destination[1], 2));
    }

    distancePerTick(speed){
        return speed / 60;
    }
}