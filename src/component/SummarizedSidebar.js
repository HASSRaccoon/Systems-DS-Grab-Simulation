import React, { useEffect, useState } from "react";
import * as IoIcons from "react-icons/io5";
// import Button from '@mui/material/Button';
import { Button } from "@mantine/core";
import "./Sidebar.css";
import { Text } from "@mantine/core";

export function SummarizedSidebar(props) {
  // let time = 0;
  const [time, setTime] = useState(0);
  const [state, setState] = useState("searching");
  const [jobsdone, setJobs] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [profit, setProfit] = useState(0);
  const [distance, setDistance] = useState(0);
  const [avgdistance, setAvgDistance] = useState(0);
  const [avgprofit, setAvgProfit] = useState(0);
  const [avgjobsdone, setAvgJobsDone] = useState(0);
  // const[peakHour, setPeakHour] =useState(t)
  const [weatherStatus, setWeather] = useState("Dry");
  const [peakHour, setPeakHour] = useState("Yes");

  setInterval(() => {
    const currentTime = props.timelist[0];
    setTime(currentTime);
    const currentState = props.statelist[0];
    setState(currentState);
    const currentJobs = props.jobsdonelist[0];
    setJobs(currentJobs);
    const currentSpeed = props.speedlist[0];
    setSpeed(currentSpeed);
    const currentProfit = props.profitlist[0];
    setProfit(currentProfit);
    const currentAvgProfit = props.avgprofitlist[0];
    setAvgProfit(currentAvgProfit);
    const currentAvgDistance = props.avgdistancelist[0];
    setAvgDistance(currentAvgDistance);
    const currentAvgJobs = props.avgjobsdonelist[0];
    setAvgJobsDone(currentAvgJobs);
    const currentDistance = props.distancelist[0];
    setDistance(currentDistance);
    const currentWeather = props.weatherlist[0];
    setWeather(currentWeather);
    const currentHour = props.peakHourlist[0];
    setPeakHour(currentHour);

    // weatherStatus={props.weatherStatus}

    // console.log(time, "update time in sidebar");
  }, 1000);
  // useEffect(() => {
  //   console.log("DOESNT ANYTHING EVEN CHANGE");
  // }, [props]);

  return (
    <div>
      <ul className="nav-menu-items">
        <div className="nav-header">
          <span> STATUS </span>
        </div>

        {/* <div className='nav-subheader'>
                        <span> Globals: </span>
                    </div> */}

        <div className="nav-text">
          <div>
            <IoIcons.IoCalendarClearOutline />
            <span>Day: 1</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoTimeOutline />
            <span>Time (min): {time}</span>
            {/* <Text>{time}</Text> */}
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoAlarmOutline />
            <span>Peak hour: {peakHour}</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoRainyOutline />
            <span>Weather: {weatherStatus}</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoFlashOutline />
            <span>Fuel Cost: $0.22/Km</span>
          </div>
        </div>

        {/* <div className="nav-text">
          <div>
            <IoIcons.IoWalletOutline />
            <span>Average Fare: $1.53/Km</span>
          </div>
        </div> */}
        <div className="nav-text">
          <div>
            <IoIcons.IoPerson />
            <span>Your state: Transit</span>
            {/* <span>Your state: {state}</span> */}
          </div>
        </div>

        <div className="nav-text">______________________</div>

        <div className="padding-subheader">
          <span> </span>
        </div>

        <div className="nav-header">
          <span> INPUTS </span>
        </div>

        <div className="nav-text">
          <div>
            <IoIcons.IoCarOutline />
            <span>Work period: 7AM-7PM</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoRestaurantOutline />
            <span>Rest period: 11AM-12PM</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoFlashOutline />
            <span>Speed: {speed} Km/h</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoHourglassOutline />
            <span>Wait behavior: Wait</span>
          </div>
        </div>
        {/* <div className="nav-text">
          <IoIcons.IoAccessibilityOutline />
          <span>Pickup tolerance: 5 Km</span>
        </div> */}

        {/* <div className='nav-button'>
                <Button variant="contained" color='primary'>see details</Button>
                </div> */}
        <div className="nav-text">______________________</div>

        <div className="padding-subheader">
          <span> </span>
        </div>

        <div className="nav-header">
          <span> OUTPUTS </span>
        </div>

        <div className="nav-subheader">
          <span> You: </span>
        </div>

        <div className="nav-text">
          <div>
            <IoIcons.IoCheckmark />
            <span>Jobs done: {jobsdone}</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoWalletOutline />
            <span>Total profit: ${profit}</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoNavigateOutline />
            <span>Total Distance: {distance}km</span>
          </div>
        </div>

        <div className="padding-subheader">
          <span> </span>
        </div>
        <div className="nav-subheader">
          <span> Average: </span>
        </div>

        <div className="nav-text">
          <div>
            <IoIcons.IoCheckmark />
            <span>Jobs done: {avgjobsdone}</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoWalletOutline />
            <span>Total profit: ${avgprofit}</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoNavigateOutline />
            <span>Total Distance: {avgdistance}km</span>
          </div>
        </div>
        <div className="details-button">
          <Button color="cyan" onClick={props.openModalGraph}>
            SEE DETAILS<span></span>
          </Button>
        </div>
        {/* <div className='nav-button'>
                <Button variant="contained" color='primary'>see details</Button>
                </div> */}
      </ul>
    </div>
  );
}
