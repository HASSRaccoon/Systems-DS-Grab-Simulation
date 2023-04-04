import sgJSON from "./road-network.json";

export default class Passenger{
    constructor(props) {
        this.id = props.id;
        this.state = 'waiting';
        this.currentLocation = this.generateRandomCoord();
        this.destination = this.generateRandomCoord();
        this.waitingTime = 0;
        this.driver = null;
        this.cancelTendency = props.cancelTendency;
    }    
    carArrived(){ 
        this.state = 'transit';
    }
    transit(){
        this.state = 'arrived';
    }
    arrived(){
        this.state = 'arrived';
    }
    cancel(){
        console.log('passenger cancelled')
    }
    generateRandomCoord() {
        let Pos =
          sgJSON.features[Math.floor(Math.random() * sgJSON.features.length)]
            .geometry.coordinates[0];
        return Pos;
    }
}
