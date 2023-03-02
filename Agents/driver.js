export default class Driver {
    constructor(location) {
        this.state = 'searching';
        this.location = location;
        this.currentLocation = location;
        this.destination = null;
        this.waitingTime = 0;
        this.speed = 1;

        this.passenger = null;

        // dumping some other (maybe stupid) attributes
        this.earnings = 0;
        this.rating = 0;
        this.raining = false;
        this.traffic = false;
        this.emotion = 'angry';
        // if (this.emotion == 'angry'){
        //     this.speed = 5;
        //     Passenger.emotion = 'scared';
        // }

        //DEBUG: for testing purpose, will remove later
        this.passengers = 3; 
        this.passengerLocation = [100,50,10];
        this.passengerDestination = [120,70,20];
    }
    search(){
        if (true){ //FIXME: if there is passenger appear
            this.state = 'picking up';
            this.passengers -= 1; //DEBUG: for testing
        }
        else{ //while waiting passenger to appear
            this.location += this.speed; //FIXME: driver roaming ard the map
        }
    }
    pickUp(passenger){
        this.passenger = passenger;
        this.destination = passenger.location;
        while (this.currentLocation != this.destination){
            console.log(`driver current location when picking up: ${this.currentLocation}`)
            this.currentLocation += this.speed;
        }
        if (this.currentLocation == this.destination){
            this.state = 'transit';
        }
    }
    transit(){
        this.destination = this.passenger.destination;
        while (this.currentLocation != this.destination){
            console.log(`driver current location when transit: ${this.currentLocation}`)
            this.currentLocation += this.speed;
        }
        if (this.currentLocation == this.destination){
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
}


// let driver = new Driver(0);
// driver.test();