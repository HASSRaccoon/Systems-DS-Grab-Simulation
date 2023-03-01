class Driver {
    constructor(location) {
        this.state = 'searching';
        this.location = location;
        this.currentLocation = location;
        this.destination = null;
        this.waitingTime = 0;
        this.speed = 2;

        //DEBUG: for testing purpose, will remove later
        this.passenger = 3; 
        this.passengerLocation = [100,50,10];
        this.passengerDestination = [120,70,20];
    }
    search(){
        if (true){ //FIXME: if there is passenger appear
            this.state = 'picking up';
            this.passenger -= 1; //DEBUG: for testing
        }
        else{ //while waiting passenger to appear
            this.location += this.speed; //FIXME: driver roaming ard the map
        }
    }
    pickUp(passengerLocation){
        this.destination = passengerLocation;
        if (this.currentLocation == this.destination){
            this.state = 'transit';
        }
        else { //DEBUG: current testing method, will remove later
            this.currentLocation += this.speed;
            console.log(this.currentLocation)
        }
    }
    transit(passengerDestination){
        this.destination = passengerDestination;
        if (this.currentLocation == this.destination){
            this.state = 'completed';
        }
        else { //DEBUG: current testing method, will remove later
            this.currentLocation += this.speed;
            console.log(this.currentLocation)
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
                    this.pickUp(this.passengerLocation[this.passenger - 1]);
                    break;
                case 'transit':
                    console.log('Transiting')
                    this.transit(this.passengerDestination[this.passenger - 1]);
                    break
                case 'completed':
                    this.completed();
                    break
            }
        }
    }
}


let driver = new Driver(0);
driver.test();