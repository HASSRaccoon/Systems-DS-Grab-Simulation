import React from "react";
import * as IoIcons from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import Button from '@mui/material/Button';
import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  Select,
  Slider,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { ScrollArea } from "@mantine/core";
import "./Sidebar.css";

export function PersonalityQuiz(props) {
  // const navigate = useNavigate();
  // const [workPeriod, setWorkPeriod] = useState([{ start: "1PM", end: "6PM" }]);
  // const [restPeriod, setRestPeriod] = useState([{ start: "4PM", end: "5PM" }]);
  // function passtoMap() {
  //   navigate("/", {
  //     data: { workPeriod: workPeriod, restPeriod: restPeriod },
  //   });
  // }

  // console.log(props.createSpecialDriver, "hello what is this");

  const [startWork, setStartWork] = useState("");
  const [endWork, setEndWork] = useState("");
  const [startBreak, setStartBreak] = useState("");
  const [endBreak, setEndBreak] = useState("");
  const [inputspeed, setInputSpeed] = useState(0);
  const [behaviour, setBehaviour] = useState("");
  const [tolerance, setTolerance] = useState(0);

  function getStartWork(e) {
    setStartWork(e);
    console.log(startWork, "hello 1");
  }

  function getEndWork(e) {
    setEndWork(e);
    console.log(endWork, "hello 2");
  }
  function getStartBreak(e) {
    setStartBreak(e);
    console.log(startBreak, "hello 3");
  }
  function getEndBreak(e) {
    setEndBreak(e);
    console.log(endBreak, "hello 4");
  }

  function getInputSpeed(e) {
    setInputSpeed(e);
    console.log(inputspeed, "hello 5");
  }
  function getBehaviour(e) {
    setBehaviour(e);
    console.log(behaviour, "hello 6");
  }
  function getTolerance(e) {
    setTolerance(e);
    console.log(tolerance, "hello 7");
  }

  const form = useForm({
    initialValues: {
      workPeriod: "",
      restPeriod: "",
      speed: "",
      waitBehavior: "",
    },
    validationRules: {
      workPeriod: (value) => value.length > 0,
      restPeriod: (value) => value.length > 0,
      speed: (value) => value.length > 0,
      waitBehavior: (value) => value.length > 0,
    },
  });

  // console.log('quiz time')

  return (
    <div>
      {/* <div className="disable-map">
        <img src= "/Black-Background-PNG-Photo.png" alt="map disabled" />
      </div> */}
      <ul className="nav-menu-items">
        {/* <ScrollArea> */}
        <div className="nav-header">
          <span> HOW DO YOU DRIVE? </span>
        </div>

        <div className="nav-subheader">
          <IoIcons.IoCarOutline />
          <span> Your Working Period: </span>
        </div>

        <div className="nav-smallspace"></div>

        <div className="nav-desc">
          <span>What time would you like to start and end work?</span>
        </div>
        <span> </span>

        <div className="nav-desc">
          <Select
            placeholder="START"
            data={[
              { value: 24, label: "0 AM" },
              { value: 1, label: "1 AM" },
              { value: 2, label: "2 AM" },
              { value: 3, label: "3 AM" },
              { value: 4, label: "4 AM" },
              { value: 5, label: "5 AM" },
              { value: 6, label: "6 AM" },
              { value: 7, label: "7 AM" },
              { value: 8, label: "8 AM" },
              { value: 9, label: "9 AM" },
              { value: 10, label: "10 AM" },
              { value: 11, label: "11 AM" },
              { value: 12, label: "12 PM" },
              { value: 13, label: "1 PM" },
              { value: 14, label: "2 PM" },
              { value: 15, label: "3 PM" },
              { value: 16, label: "4 PM" },
              { value: 17, label: "5 PM" },
              { value: 18, label: "6 PM" },
              { value: 19, label: "7 PM" },
              { value: 20, label: "8 PM" },
              { value: 21, label: "9 PM" },
              { value: 22, label: "10 PM" },
              { value: 23, label: "11 PM" },
            ]}
            onChange={(e) => getStartWork(e)}
          />
          <span>to:</span>
          <span> </span>

          <Select
            placeholder="END"
            data={[
              { value: 24, label: "0 AM" },
              { value: 1, label: "1 AM" },
              { value: 2, label: "2 AM" },
              { value: 3, label: "3 AM" },
              { value: 4, label: "4 AM" },
              { value: 5, label: "5 AM" },
              { value: 6, label: "6 AM" },
              { value: 7, label: "7 AM" },
              { value: 8, label: "8 AM" },
              { value: 9, label: "9 AM" },
              { value: 10, label: "10 AM" },
              { value: 11, label: "11 AM" },
              { value: 12, label: "12 PM" },
              { value: 13, label: "1 PM" },
              { value: 14, label: "2 PM" },
              { value: 15, label: "3 PM" },
              { value: 16, label: "4 PM" },
              { value: 17, label: "5 PM" },
              { value: 18, label: "6 PM" },
              { value: 19, label: "7 PM" },
              { value: 20, label: "8 PM" },
              { value: 21, label: "9 PM" },
              { value: 22, label: "10 PM" },
              { value: 23, label: "11 PM" },
            ]}
            onChange={(e) => getEndWork(e)}
            // onSelect={(e) => getEndWork(e)}
          />
          <span></span>
        </div>
        <span> </span>
        <div className="nav-subheader">
          <IoIcons.IoRestaurantOutline />
          <span> Your Resting Period: </span>
        </div>

        <div className="nav-smallspace"></div>

        <div className="nav-desc">
          <span>What time would you like to rest?</span>
        </div>
        <div className="nav-desc"></div>

        <div className="nav-desc">
          <Select
            placeholder="START"
            data={[
              { value: 24, label: "0 AM" },
              { value: 1, label: "1 AM" },
              { value: 2, label: "2 AM" },
              { value: 3, label: "3 AM" },
              { value: 4, label: "4 AM" },
              { value: 5, label: "5 AM" },
              { value: 6, label: "6 AM" },
              { value: 7, label: "7 AM" },
              { value: 8, label: "8 AM" },
              { value: 9, label: "9 AM" },
              { value: 10, label: "10 AM" },
              { value: 11, label: "11 AM" },
              { value: 12, label: "12 PM" },
              { value: 13, label: "1 PM" },
              { value: 14, label: "2 PM" },
              { value: 15, label: "3 PM" },
              { value: 16, label: "4 PM" },
              { value: 17, label: "5 PM" },
              { value: 18, label: "6 PM" },
              { value: 19, label: "7 PM" },
              { value: 20, label: "8 PM" },
              { value: 21, label: "9 PM" },
              { value: 22, label: "10 PM" },
              { value: 23, label: "11 PM" },
            ]}
            onChange={(e) => getStartBreak(e)}
          />
          <span>to:</span>
          <span> </span>

          <Select
            placeholder="END"
            onChange={(e) => getEndBreak(e)}
            data={[
              { value: 24, label: "0 AM" },
              { value: 1, label: "1 AM" },
              { value: 2, label: "2 AM" },
              { value: 3, label: "3 AM" },
              { value: 4, label: "4 AM" },
              { value: 5, label: "5 AM" },
              { value: 6, label: "6 AM" },
              { value: 7, label: "7 AM" },
              { value: 8, label: "8 AM" },
              { value: 9, label: "9 AM" },
              { value: 10, label: "10 AM" },
              { value: 11, label: "11 AM" },
              { value: 12, label: "12 PM" },
              { value: 13, label: "1 PM" },
              { value: 14, label: "2 PM" },
              { value: 15, label: "3 PM" },
              { value: 16, label: "4 PM" },
              { value: 17, label: "5 PM" },
              { value: 18, label: "6 PM" },
              { value: 19, label: "7 PM" },
              { value: 20, label: "8 PM" },
              { value: 21, label: "9 PM" },
              { value: 22, label: "10 PM" },
              { value: 23, label: "11 PM" },
            ]}
          />
          <span> </span>
        </div>
        <div className="nav-desc"></div>

        <div className="nav-subheader">
          <IoIcons.IoFlashOutline />
          <span> Your Driving Speed: </span>
        </div>

        <div className="nav-smallspace"></div>
        <div className="nav-desc">
          <span>What is your average driving speed during dry weather? </span>
        </div>
        <div className="nav-desc"></div>
        <div className="nav-slider">
          <Slider
            marks={[
              { value: 0, label: "0Km/h" },
              { value: 50, label: "50Km/h" },
              { value: 100, label: "100Km/h" },
            ]}
          />
        </div>
        <div className="nav-desc"></div>
        <div className="nav-subheader">
          <IoIcons.IoHourglassOutline />
          <span> Your Waiting Behavior: </span>
        </div>

        <div className="nav-smallspace"></div>
        <div className="nav-desc">
          <span>When you are waiting to get a passenger, you: </span>
        </div>
        <span> </span>
        <div className="nav-desc">
          <span> </span>
          <Select
            placeholder="choose one"
            data={[
              { value: "wait", label: "wait on the spot" },
              { value: "drive", label: "drive around" },
            ]}
          />
        </div>
        <span> </span>

        <div className="nav-subheader">
          <IoIcons.IoHourglassOutline />
          <span> Your Pickup Tolerance: </span>
        </div>

        <div className="nav-smallspace"></div>
        <div className="nav-desc">
          <span>Maximum distance you're willing to travel to pickup: </span>
        </div>
        <div className="small-space"></div>
        <div className="nav-slider">
          <span></span>
          <Slider
          min={0}
          max={10}
            marks={[
              { value: 0, label: "0 Km" },
              { value: 5, label: "5 Km" },
              { value: 10, label: "10 Km" },
            ]}
          />
        </div>

        <span> </span>

        <span> </span>

        <div className="start-button">
          <Button color="cyan" onClick={props.handleRenderQuiz}>
            START SIMULATION<span></span>
          </Button>
        </div>
        {/* <Button onClick={props.createSpecialDriver()}>CHECK PASSING</Button> */}
        {/* <div className='nav-button'>
                <Button variant="contained" color='primary'>see details</Button>
                </div> */}
        {/* </ScrollArea> */}
      </ul>
    </div>
  );
}
