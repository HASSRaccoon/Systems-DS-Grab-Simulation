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
    }
    search(passenger){
        this.passenger = passenger;
        if (this.passenger){ 
            this.state = 'picking up';
        }
        else{
            this.currentLocation += this.speed;
        }
    }
    pickUp(passenger){
        this.destination = this.passenger.location;
        if (this.currentLocation != this.destination){
            this.currentLocation += this.speed;
            console.log(`driver current location when picking up: ${this.currentLocation}`)
        }
        if (this.currentLocation == this.destination){
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
}