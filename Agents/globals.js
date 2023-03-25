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
        this.jobsCompleted = 0;
        this.jobsCancelled = 0;
        this.idleDrivers = 0;
        this.busyDrivers = 0;

        this.passengersWaiting = 0;

        this.agentsInTransit = 0;

        // OTHERS
        this.pricePerKm = 1;
    }

    // FUNCTIONS
    set raining(value) {
        if (this._raining !== value) {
            this._raining = value;
            this._drivers.forEach(driver => driver.updateSpeed(this._raining));
      }}
    
    get raining() {
        return this._raining;
      }
    
    registerDriver(driver) {
        this._drivers.push(driver);
      }
    
    unregisterDriver(driver) {
        const index = this.drivers.indexOf(driver);
        if (index !== -1) {
          this._drivers.splice(index, 1);
        }
      }
}