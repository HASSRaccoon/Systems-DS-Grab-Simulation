export function passenger(location, destination, driver){
    let state = 'waiting';
    let currentLocation = location;
    let passengerDestination = destination;
    let waitingTime = 0;
    // let driver = null;

    let appearTime = Date.now() / 1000 | 0;
    console.log(`Passenger appear at ${appearTime}`)

    while (true){ //FIXME:
        switch (state){
            case 'waiting':
                console.log("Car arrived");
                carArrived(Date.now() / 1000 | 0, driver);
                break;
            case 'transit':
                console.log('Transiting')
                transit();
                break;
            case 'arrived':
                console.log('Arrived')
                break
        }
        if (state == 'arrived'){
            console.log('Disappearing')
            console.log(`Total waiting time: ${waitingTime}`)
            break;
        }
    }
}

function carArrived(timestamp, driver){ 
    console.log(driver)
    driver = driver;
    if (driver.currentLocation == location){
        waitingTime = timestamp - appearTime;
        console.log(`Passenger waiting time: ${waitingTime}`)
        state = 'transit';
    }
}

function transit(){
    currentLocation = driver.currentLocation; //FIXME: update the current location of the passenger while transiting (same as grab's location)
    console.log(`passenger current location when transit: ${currentLocation}`)
    if (currentLocation == destination){
        state = 'arrived';
    }
}

function arrived(){
    state = 'arrived';
    // removePassenger(); //FIXME: remove passenger from the screen
}