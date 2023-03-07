import React, { useState } from 'react';

function Driver(props){
    const [state, setState] = useState('searching');
    const [waitingTime, setWaitingTime] = useState(0);
    const [currentLocation, setCurrentLocation] = useState(props.location);
    const [destination, setDestination] = useState(props.destination);
    const [drivingSpeed, setDrivingSpeed] = useState(props.speed);
    // const [distanceWillingToTravel, setDistanceWillingToTravel] = useState(0);
    // const [completedJobs, setCompletedJobs] = useState(0);
    const [passenger, setPassenger] = useState(props.passenger);
    const [earnings, setEarnings] = useState(0);
    // const [rating, setRating] = useState(0);

    function search(passenger){
        setPassenger(passenger);
        if (passenger){ 
            setState('picking up');
        }
        else{
            setCurrentLocation(currentLocation + drivingSpeed);
            setWaitingTime(waitingTime + 1); //FIXME: need to add the correct timestamp
        }
    }

    function pickUp(){
        setDestination(passenger.location);
        if (currentLocation != destination){
            setCurrentLocation(currentLocation + drivingSpeed);
            console.log(`driver current location when picking up: ${currentLocation}`)
        }
        else{ //FIXME:
            setState('transit');
        }
    }

    function transit(){
        setDestination(passenger.destination);
        if (currentLocation != destination){
            setCurrentLocation(currentLocation + drivingSpeed);
            console.log(`driver current location when transit: ${currentLocation}`)
        }
        else{
            setState('completed');
        }
    }

    function completed(){
        setState('searching');
        setEarnings(earnings + 10);
    }

    while (passenger){ //FIXME:
        switch (state){
            case 'searching':
                console.log("Searching")
                search();
                break;
            case 'picking up':
                console.log('picking up')
                pickUp();
                break;
            case 'transit':
                console.log('Transiting')
                transit();
                break
            case 'completed':
                completed();
                break
        }
    }
}

export default Driver;

// function search(passenger){
//     passenger = passenger;
//     if (passenger){ 
//         state = 'picking up';
//     }
//     else{
//         currentLocation += drivingSpeed;
//         waitingTime += 1; //FIXME: need to add the correct timestamp
//     }
// }

// function pickUp(){
//     destination = passenger.location;
//     if (currentLocation != destination){
//         currentLocation += drivingSpeed;
//         console.log(`driver current location when picking up: ${currentLocation}`)
//     }
//     else{ //FIXME:
//         state = 'transit';
//     }
// }

// function transit(){
//     destination = passenger.destination;
//     if (currentLocation != destination){
//         currentLocation += drivingSpeed;
//         console.log(`driver current location when transit: ${currentLocation}`)
//     }
//     else{
//         state = 'completed';
//     }
// }

// function completed(){
//     state = 'searching';
// }