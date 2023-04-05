import React, { useEffect, useState } from "react";
import * as IoIcons from "react-icons/io5";
// import Button from '@mui/material/Button';
import { Button } from "@mantine/core";
import "./Sidebar.css";
import { Text } from "@mantine/core";

export function SummarizedSidebar(props) {
  console.log(props.driver, "pass driver can?");
  console.log(typeof props.driver, "type");
  console.log(props.time);
  //   const [time, setTime] = useState(props.driver.timeCounter);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(props.driver.time);
  const [speed, setSpeed] = useState(props.driver.speed);
  const [state, setState] = useState(props.driver.state);

  useEffect(() => {
    //     console.log(props.driver, "does he update");
    const currentTime = props.time;
    setTime(currentTime);
    // console.log(currentTime, "does he update");
    // console.log(time, "does he update");
    // const currentSpeed = props.driver.speed;
    // setSpeed(currentSpeed);
  }, [props.time]);

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
            <span>Day:</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoTimeOutline />
            <span> Time: {props.time}</span>
            {/* <Text>{time}</Text> */}
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoAlarmOutline />
            <span>Peak hour:</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoRainyOutline />
            <span>Weather:</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoPerson />
            <span>Your state:{state}</span>
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
            <span>Work period:</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoRestaurantOutline />
            <span>Rest period:</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoFlashOutline />
            <span>Speed:{speed}</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoHourglassOutline />
            <span>Wait behavior:</span>
          </div>
        </div>
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
            <span>Jobs done:</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoWalletOutline />
            <span>Total profit:</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoNavigateOutline />
            <span>Total Distance:</span>
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
            <span>Jobs done:</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoWalletOutline />
            <span>Total profit:</span>
          </div>
        </div>
        <div className="nav-text">
          <div>
            <IoIcons.IoNavigateOutline />
            <span>Total Distance:</span>
          </div>
        </div>
        <div className="details-button">
          <Button color="cyan">
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
