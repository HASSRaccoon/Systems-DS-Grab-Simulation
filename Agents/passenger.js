export default class Passenger{
    constructor(props) {
        this.id = props.id;
        this.state = 'waiting';
        this.currentLocation = props.currentLocation;
        this.destination = props.destination;
        this.waitingTime = 0;
        this.driver = null;
        this.ref = props.ref;
        this.cancelTendency = props.cancelTendency;

        this.appearTime = Date.now() / 1000 | 0;
    }    

    wait(){
        console.log('wait')
    }
    carArrived(timestamp){ 
        this.state = 'transit';
        if (this.driver.currentLocation == this.currentLocation){
            this.waitingTime = timestamp - this.appearTime;
            this.state = 'transit';
        }
    }
    transit(){
        // this.currentLocation = this.driver.currentLocation; //FIXME: update the current location of the passenger while transiting (same as grab's location)
    }
    arrived(){
        this.state = 'arrived';
    }
    cancel(){
        console.log('passenger cancelled')
        // this.driver.passenger = null;
    }
}
