import sgJSON from "./../data/road-network.json";

export default class Passenger {
  constructor(props) {
    this.id = props.id;
    this.state = "waiting";
    this.currentLocation = this.generateRandomCoord();
    this.destination = this.generateRandomCoord();
    // this.currentLocation = props.currentLocation;
    // this.destination = props.destination;
    this.waitingTime = 0;
    this.driver = null;
    this.cancelTendency = props.cancelTendency;
  }
  carArrived() {
    this.state = "transit";
  }
  transit() {
    this.state = "arrived";
  }
  arrived() {
    this.state = "arrived";
  }
  cancel() {
    console.log(this.id, " cancelled");
  }
  generateRandomCoord() {
    let featureIndex = Math.floor(Math.random() * sgJSON.features.length);
    let coordinateIndex = Math.floor(
      Math.random() * sgJSON.features[featureIndex].geometry.coordinates.length
    );

    let Pos =
      sgJSON.features[featureIndex].geometry.coordinates[coordinateIndex];
    return Pos;
  }
}
