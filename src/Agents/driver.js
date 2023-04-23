import sgJSON from "../data/road-network.json";

export default class Driver {
  constructor(props) {
    //// Global affecting ////
    this.speed = props.speed;
    /////////////////////////

    this.id = props.id;
    this.state = "searching";
    this.moveRadius = props.moveRadius;
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
    this.searchLocation = this.currentLocation;

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
    } else {
      // this.speed /= 0.8;
      this.speed /= 0.84; //revert to normal speed if not raining
    }
  }
  search(passenger, ticks, globals) {
    if (this.passenger) {
      // if passenger found
      this.speedLs.push(0);
      // this.time += 1;
      let fuelCost = globals.fuelcostCalculation(this.distance);
      this.tripFuelCost += fuelCost;
      this.tripDistance += this.distance;
      this.tripTime += this.time;

      this.endLocation = this.currentLocation;

      this.jobLog["searching"] = {
        "start location": this.initialLocation,
        "end location": this.endLocation,
        "time spent": this.time,
        distance: this.distance,
        "current time": ticks,
        speed: this.speedLs,
        fuelcost: fuelCost,
        radius: this.radius,
      }; //NOTE: log here

      //NOTE: clear logged data
      this.distance = 0;
      this.time = 0;
      this.speedLs = [];

      this.destination = this.passenger.currentLocation;

      this.initialLocation = this.endLocation;
      this.endLocation = null;
      this.state = "picking up";
      this.path = null;
      this.distanceToTravel = 0;
      console.log(`Driver ${this.id} in transit to pickup passenger`);
      return false; //NOTE: indicate that driver did not move because passenger is found
    } else {
      // if no passenger found
      this.passenger = passenger;

      if (this.destination === null || this.distanceToTravel === 0) {
        // if no destination set or destination reached
        this.time += 1;
        // let setDestinationRandom = Math.random();
        if (this.time > this.framesToMove) {
          // if time spent searching is more than framesToMove
          this.destination = this.generateRandomCoordBelow(
            this.currentLocation,
            this.moveRadius
          );
          this.speedLs.push(0);
        }
        return false; //is not moving
      } else {
        // if destination is set and not reached

        let speed = this.distancePerTick(this.speed);
        this.speedLs.push(speed);
        let minTime = Math.min(1, this.distanceToTravel / speed); //NOTE: time is in tick, time spent to travel to passenger location
        this.time += minTime;
        //if destination is > distance covered in 1 tick
        if (minTime === 1 && this.distanceToTravel !== speed) {
          this.distance += speed;
          this.distanceToTravel -= speed;
          return true;
        } else {
          // if destination is < distance covered in 1 tick
          //NOTE: add the remainder
          this.distance += this.distanceToTravel;
          this.distanceToTravel = 0;
          this.currentLocation = this.destination;
          if (this.time > this.framesToMove) {
            // if time spent searching is more than framesToMove
            this.destination = this.generateRandomCoordBelow(
              this.currentLocation,
              this.moveRadius
            );
          } else {
            this.destination = null;
          }
          return false; //is moving
        }
      }
    }
  }
  pickUp(ticks, globals) {
    // console.log(this.id, ' pick up distance', this.distance, 'pick up to travel', this.distanceToTravel)
    let speed = this.distancePerTick(this.speed);
    this.speedLs.push(speed);
    let minTime = Math.min(1, this.distanceToTravel / speed); //NOTE: time is in tick, time spent to travel to passenger location
    this.time += minTime;

    if (minTime === 1 && this.distanceToTravel !== speed) {
      //NOTE: like 4km -> 2.66km etc (no remainder)
      this.distance += speed;
      this.distanceToTravel -= speed;
      // return false;
    } else {
      //NOTE: add the remainder
      this.distance += this.distanceToTravel;
      this.distanceToTravel = 0;

      this.timeFlag = ticks; //NOTE: time flag to check if it is peak hour on pickup
      let fuelCost = globals.fuelcostCalculation(this.distance);
      this.tripFuelCost += fuelCost;
      this.tripDistance += this.distance;
      this.tripTime += this.time;

      this.endLocation = this.passenger.currentLocation;

      this.jobLog["pick up"] = {
        "start location": this.initialLocation,
        "end location": this.endLocation,
        "time spent": this.time,
        distance: this.distance,
        "current time": ticks,
        speed: this.speedLs,
        fuelcost: fuelCost,
      }; //NOTE: log here

      //NOTE: clear logged data
      this.distance = 0;
      this.time = 0;

      this.initialLocation = this.endLocation;
      this.endLocation = null;
      console.log(`Driver ${this.id} in transit to passenger destination`);
      this.state = "transit";
      this.destination = this.passenger.destination;
      this.speedLs = [];
      this.path = null;

      // return true;
    }
  }
  transit(ticks, globals) {
    // console.log(this.id, ' transit distance', this.distance, 'transit to travel', this.distanceToTravel)
    let speed = this.distancePerTick(this.speed);
    this.speedLs.push(speed);
    let minTime = Math.min(1, this.distanceToTravel / speed); //NOTE: time is in tick, time spent to travel to passenger location
    this.time += minTime;

    if (minTime === 1 && this.distanceToTravel !== speed) {
      this.distance += speed;
      this.distanceToTravel -= speed;
      // return false;
    } else {
      //NOTE: add the remainder
      this.distance += this.distanceToTravel;
      this.distanceToTravel = 0;

      let fare = globals.fareCalculation(
        this.distance,
        this.time,
        this.timeFlag
      );
      this.tripFare = fare;
      let fuelCost = globals.fuelcostCalculation(this.distance);
      this.tripFuelCost += fuelCost;
      this.tripDistance += this.distance;
      this.tripTime += this.time;

      this.endLocation = this.destination;

      this.jobLog["transit"] = {
        "start location": this.initialLocation,
        "end location": this.endLocation,
        "time spent": this.time,
        distance: this.distance,
        "current time": ticks,
        speed: this.speedLs,
        fuelcost: fuelCost,
        fare: fare,
      }; //NOTE: log here

      // NOTE: clear logged data
      this.distance = 0;
      this.time = 0;
      this.speedLs = [];

      this.initialLocation = this.endLocation;
      console.log(`Driver ${this.id} completed trip`);
      this.state = "completed";
      this.currentLocation = this.endLocation;
      this.path = null;
      // return true;
    }
  }
  completed(globals) {
    let profits = globals.profitCalculation(this.tripFare, this.tripFuelCost);

    this.jobLog["totals"] = {
      "start location": this.searchLocation,
      "end location": this.endLocation,
      "time spent": this.tripTime,
      distance: this.tripDistance,
      fuelcost: this.tripFuelCost,
      fare: this.tripFare,
      profit: profits,
    };
    this.state = "searching";
    this.completedJobs += 1;
    this.passenger = null;
    this.destination = null;

    this.searchLocation = this.currentLocation;

    this.endLocation = null;
    this.speedLs = [];
    this.resetTripVariables();
    console.log(`Driver ${this.id} searching for passenger`);

    this.log[`${this.completedJobs}`] = { ...this.jobLog };
    console.log(`Driver ${this.id}'s log`, this.log);
  }

  // break(){
  //     this.state = 'break';
  //     this.breakTime = 0;
  //     this.breakLocation = this.currentLocation;
  // }

  distancePerTick(speed) {
    return speed / 60;
  }

  generateRandomCoord() {
    //NOTE: generate random coordinate within singapore
    let featureIndex = Math.floor(Math.random() * sgJSON.features.length);
    let coordinateIndex = Math.floor(
      Math.random() * sgJSON.features[featureIndex].geometry.coordinates.length
    );

    let Pos =
      sgJSON.features[featureIndex].geometry.coordinates[coordinateIndex];
    // console.log('Pos', Pos);
    return Pos;
  }

  resetTripVariables() {
    //NOTE: reset trip variables
    this.tripDistance = 0;
    this.tripTime = 0;
    this.tripFuelCost = 0;
    this.tripFare = 0;
  }

  deg2rad(deg) {
    //NOTE: convert degree to radian
    return deg * (Math.PI / 180);
  }

  getDistance(start, end) {
    // NOTE: start and end are [lon, lat]
    let lat1 = start[1];
    let lon1 = start[0];
    let lat2 = end[1];
    let lon2 = end[0];

    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  generateRandomCoordBelow(startCoord, distance) {
    let randomCoord = this.generateRandomCoord();
    let distanceToRandomCoord = this.getDistance(startCoord, randomCoord);
    while (distanceToRandomCoord > distance) {
      randomCoord = this.generateRandomCoord();
      distanceToRandomCoord = this.getDistance(startCoord, randomCoord);
    }
    console.log(
      "Found randomCoord",
      randomCoord,
      "distance",
      distanceToRandomCoord
    );
    return randomCoord;
  }
}
