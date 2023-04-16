import React, { useState } from "react";
import * as IoIcons from "react-icons/io5";
import { Link } from "react-router-dom";
import { SummarizedSidebar } from "./SummarizedSidebar";
import "./Sidebar.css";
import { IconContext } from "react-icons";
import { Button } from "@mantine/core";
// import Button from '@mui/material/Button';
// import { StatusDetails } from './StatusDetails';
import { StatusDetails } from "./StatusDetails";
import { PersonalityQuiz } from "./PersonalityQuiz";

function Sidebar(props) {
  const [renderType, setRenderType] = useState("quiz");

  const handleRenderQuiz = () => {
    setRenderType("summary");
    props.setVisible((v) => !v);
  };

  const handleRenderSummary = () => {
    setRenderType("details");
  };

  const handleRenderDetails = () => {
    setRenderType("summary");
  };

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <nav className="nav-menu active">
          <div>
            {renderType === "quiz" && (
              <PersonalityQuiz
                handleRenderQuiz={handleRenderQuiz}
                createSpecialDriver={props.createSpecialDriver}
                visible={props.visible}
                handlecreatedDriver={props.handlecreatedDriver}
                setVisible={props.setVisible}
              />
            )}
            {renderType === "summary" && (
              <SummarizedSidebar
                label={props.label}
                statelist={props.statelist}
                timelist={props.timelist}
                speedlist={props.speedlist}
                jobsdonelist={props.jobsdonelist}
                profitlist={props.profitlist}
                distancelist={props.distancelist}
                avgdistancelist={props.avgdistancelist}
                avgprofitlist={props.avgprofitlist}
                avgjobsdonelist={props.avgjobsdonelist}
                weatherlist={props.weatherlist}
                peakHourlist={props.peakHourlist}
                handleRenderSummary={handleRenderSummary}
                openModalGraph={props.openModalGraph}
              />
            )}
            {renderType === "details" && (
              <StatusDetails
                profitlist={props.profitlist}
                avgprofitlist={props.avgprofitlist}
                peakHourlist={props.peakHourlist}
                timelist={props.timelist}
                weatherlist={props.weatherlist}
                handleRenderDetails={handleRenderDetails}
                openModalGraph={props.openModalGraph}
              />
            )}

            {/* <SummarizedSidebar
            driver={props.driver}
            Log={props.Log}
            timeLog={props.timeLog}
            isRunning={props.isRunning}
            time={props.time}  
            setTime={props.time}
            jobsDone={props.jobsDone}
            setjobsDone={props.setjobsDone}
            toggleDetails={toggleDetails}
            /> */}
            {/* <StatusDetails></StatusDetails> */}
            {/* {<PersonalityQuiz />} */}
          </div>
        </nav>

        {/* <div className='ffw-button'>
                <Button variant="contained" color='primary'>
                    
                    <IoIcons.IoPlayForwardOutline /><span className='ffw-text'> FFW </span>
                </Button>
        </div> */}
      </IconContext.Provider>
    </>
  );
}

export default Sidebar;
