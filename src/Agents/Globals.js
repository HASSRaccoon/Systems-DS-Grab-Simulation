export default class Globals{
    constructor(){

        // INPUTS
        this._raining = false;
        this.traffic = false;
        this.location = 'Singapore';
        this.timeofday = 'day';
        this.companyProfitShare = 0.1;

        // OUTPUTS
        this.companyProfit = 0;
        this.driverProfit = 0;

        this.totalPassengerWaitingTime = 0;
        this.totalDriverWaitingTime = 0;
        this.averagePassengerWaitingTime = this.totalPassengerWaitingTime / this.jobsCompleted;
        this.averageDriverWaitingTime = this.totalDriverWaitingTime / this.jobsCompleted;
        
        // FORMULAS
        this.passengerSatisfactionIndex = 0; //insert formula
        this.driverSatisfactionIndex = 0; //insert formula
        this.overallSatisfactionIndex = (this.passengerSatisfactionIndex + this.driverSatisfactionIndex) / 2;
        
        // STATUS
        this._drivers = [];
        this.jobsCompleted = [];
        this.jobsCancelled = [];
        this.idleDrivers = 0;
        this.busyDrivers = 0;

        this.passengersWaiting = 0;

        this.agentsInTransit = 0;

        // OTHERS
        this.pricePerKm = 0.5;
        this.pricePerMinute = 0.16;
        this._isPeakHour = false;
        this.commissionReduction = 0.2;
        this.peakFareMultiplier = 1.5;
        this.platformFee = 0.3;
        this.fuelcostPer100Km = 22.4; // $/100km
    }

    // FUNCTIONS
    set raining(value) {
      if (this._raining !== value) {
        this._raining = value;
        this._drivers.forEach(driver => driver.updateSpeed(this._raining));
      }
    }
    
    get raining() {
        return this._raining;
      }

    get drivers() {
        return this._drivers;
      }
    
    registerDriver(driver) {
        this._drivers.push(driver);
        console.log(`(LOG) registered driver ${driver.id}: `, driver)
      }
    
    unregisterDriver(driver) {
        const index = this.drivers.indexOf(driver);
        if (index !== -1) {
          this._drivers.splice(index, 1);
        }
      }
    
    showStats(){
      this._drivers.forEach(driver => this.jobsCompleted.push(driver.completedJobs));
      this._drivers.forEach(driver => this.jobsCancelled.push(driver.cancelledJobs));
      console.log('Completed jobs:', this.jobsCompleted);
      console.log('Cancelled jobs:', this.jobsCancelled);
      // clear the arrays
      this.jobsCompleted = [];
      this.jobsCancelled = [];
    }

    // -------------- Profit Calculation --------------

    checkPeak(tick) {
      // check if it is peak hour (7am to 10am and 5pm to 8pm)
      // takes in tick as integer (where 1 tick = 1 minute in simulationtime)
      // Returns true if it is peak hour, false otherwise
      let currTick = tick;
      if (currTick > 1440) {
        currTick = currTick % 1440;
      }
      // Convert the tick to hours
      var currentHour = Math.floor(currTick/60);

      // Check if the current time falls within the first time range (7am to 10am)
      const isMorningPeak = currentHour >= 7 && currentHour <= 10;
      // Check if the current time falls within the second time range (5pm to 8pm)
      const isEveningPeak = currentHour >= 17 && currentHour <= 20;
      // Print the result
      if (isMorningPeak || isEveningPeak) {
        this._isPeakHour = true;
        // console.log("The current time is within the specified range.");
      } else {
        this._isPeakHour = false;
        // console.log("The current time is outside the specified range.");
      }
      return this._isPeakHour;
    }
  
    fareCalculation(distance, minutes, tick) {
      // uses checkPeak to determine if it is peak hour
      // distance in km
      // minutes in minutes
      // datetime in datetime object for checkPeak
      // returns fare in dollars
  
      // calculate the fare
      const fare =
        3.5 + this.pricePerKm * distance + this.pricePerMinute * minutes;
      const finalfare =
        this.checkPeak(tick) === true ? fare * this.peakFareMultiplier : fare;
      return ((finalfare*(1-this.commissionReduction)) - this.platformFee);
    }

    fuelcostCalculation(distance){
      // distance in km
      // returns fuel cost in dollars
      const fuelcost = distance * (this.fuelcostPer100Km/100);
      return fuelcost;
    }
  
    profitCalculation(fare, fuelcost){
        const profit = fare - fuelcost;
        return profit;
    }







}