import React, { useEffect, useState } from "react";
import * as IoIcons from "react-icons/io5";
import { Button, Modal, Center } from "@mantine/core";
import "./Sidebar.css";
import { useDisclosure } from "@mantine/hooks";
import { StackedChart } from "./Stackedchart";
export function StatusDetails(props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [time, setTime] = useState(0);
  const [weatherStatus, setWeather] = useState("Dry");
  const [peakHour, setPeakHour] = useState("Yes");
  const [avgprofit, setAvgProfit] = useState(0);
  const [profit, setProfit] = useState(0);
  setInterval(() => {
    const currentHour = props.peakHourlist[0];
    setPeakHour(currentHour);
    const currentWeather = props.weatherlist[0];
    setWeather(currentWeather);
    const currentTime = props.timelist[0];
    setTime(currentTime);
    const currentProfit = props.profitlist[0];
    setProfit(currentProfit);
    const currentAvgProfit = props.avgprofitlist[0];
    setAvgProfit(currentAvgProfit);
  }, 1000);

  // const handleRenderGraphs = () => {
  //     return(

  //     )
  // }

  return (
    <div>
      <ul className="nav-menu-items">
        <div className="nav-text">
          <Button onClick={props.handleRenderDetails} color="cyan">
            <IoIcons.IoArrowBackOutline /> BACK <span></span>{" "}
          </Button>
        </div>
        <div className="padding-subheader">
          <span> </span>
        </div>
        <div className="nav-header">
          <span>DETAILS</span>
        </div>

        <div className="nav-subheader">
          <span> Live Profit Comparison: </span>
        </div>
        <div className="padding-subheader"></div>

        <div className="nav-text">
          <IoIcons.IoWalletOutline />
          <span>Your profit: {profit}</span>
        </div>
        <div className="nav-text">
          <IoIcons.IoWalletOutline />
          <span>Average profit: {avgprofit}</span>
        </div>
        <div className="nav-graph">
          <img src="./dummy-graph.jpeg" width="300px"></img>
          <Button onClick={props.openModalGraph} color="cyan">
            SEE DETAILED GRAPHS<span></span>{" "}
          </Button>
        </div>
        <div className="padding-aftergraph"></div>

        <span></span>

        <div className="nav-subheader">
          <span> Globals: </span>
        </div>

        <div className="nav-text">
          <div>
            <IoIcons.IoCalendarClearOutline />
            <span>Day: 1</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoTimeOutline />
            <span>Time: {time}</span>
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

        <div className="nav-text">
          <div>
            <IoIcons.IoWalletOutline />
            <span>Average Fare: $1.53/Km</span>
          </div>
        </div>

        <div className="padding-subheader">
          <span> </span>
        </div>

        {/* <div className='nav-subheader'>
                    <span> Your Status: </span>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoCarOutline />
                        <span>State:</span>
                    </div>
                </div>
                <div className='nav-text'>
                        <IoIcons.IoCarOutline />
                        <span>Current Speed:</span>
                </div>
                <div className='nav-text'>
                        <IoIcons.IoCarOutline />
                        <span>Distance:</span>
                </div>
                <div className='nav-text'>
                        <IoIcons.IoCarOutline />
                        <span>Profit:</span>
                </div> */}

        {/* <div className='padding-subheader'>
                    <span> </span>
                </div> */}

        {/* <div className="nav-subheader">
          <span> Passengers: </span>
        </div>
        <div className="nav-text">
          <IoIcons.IoPeopleOutline />
          <span>Total: 18</span>
        </div>
        <div className="nav-text">
          <IoIcons.IoHourglassOutline />
          <span>Waiting: 15</span>
        </div>
        <div className="nav-text">
          <IoIcons.IoCarSportOutline />
          <span>Transit: 3</span>
        </div> */}
      </ul>
    </div>
  );
}
