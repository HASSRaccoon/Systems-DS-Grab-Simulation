class Passenger {
    constructor(location, destination) {
        this.state = 'waiting';
        this.location = location;
        this.currentLocation = location;
        this.destination = destination;
        this.waitingTime = 0;
    }
    carArrived(timestamp){
        this.waitingTime = timestamp; //FIXME: find how to create a timestamp when the passenger is created
        this.state = 'transit';
    }
    transit(){
        // this.currentLocation = driver.currentLocation; //FIXME: update the current location of the passenger while transiting (same as grab's location)
        if (this.currentLocation == this.destination){
            this.state = 'arrived';
        }
        else { //DEBUG: current testing method, will remove later
            this.currentLocation += 1;
        }
    }
    arrived(){
        this.state = 'arrived';
        this.removePassenger(); //FIXME: remove passenger from the screen
    }

    test(){
        let seconds = 10;
        while (true){ //FIXME:
            switch (this.state){
                case 'waiting':
                    console.log("Car arrived")
                    this.carArrived(seconds);
                    break;
                case 'transit':
                    console.log('Transiting')
                    this.transit();
                    break;
                case 'arrived':
                    console.log('Arrived')
                    break
            }
            if (this.state == 'arrived'){
                console.log('Disappearing')
                console.log(`Total waiting time: ${this.waitingTime}`)
                break;
            }
        }
    }
}


let pass = new Passenger(0, 5);
pass.test();