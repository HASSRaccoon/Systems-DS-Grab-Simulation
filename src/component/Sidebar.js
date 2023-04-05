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
//   const [sidebar, setSidebar] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
//   const [showQuiz, setShowQuiz] = useState(true);
    // const [showContent, setShowContent] = useState('quiz');
    let showContent = 'quiz';


    // const toggleContent = (content) => {
    //     if (showContent === 'quiz') {
    //         <PersonalityQuiz />
    //     } else if (showContent === 'details') {
    //         <StatusDetails />
    //     }
    //     else if (showContent === 'summary') {
    //         <SummarizedSidebar driver={props.driver}
    //         Log={props.Log}
    //         timeLog={props.timeLog}
    //         isRunning={props.isRunning}
    //         time={props.time}
    //         setTime={props.time}
    //         jobsDone={props.jobsDone}
    //         setjobsDone={props.setjobsDone}
    //         toggleDetails={toggleDetails} />
    //     }
    // }


    function toggleContent(content) {
        console.log(content, "content");
        showContent = content;
        console.log(showContent, "showContent");
    }
//   const toggleDetails = () => {
//     if (showDetails) {
//         setShowDetails(false);
//     } else {
//         setShowDetails(true);
//     }
//   };

//   let content;
//   if (showDetails) {
//     content = <StatusDetails />;
//   } else {
//     content = (
//       <SummarizedSidebar
//         driver={props.driver}
//         Log={props.Log}
//         timeLog={props.timeLog}
//         isRunning={props.isRunning}
//         time={props.time}
//         setTime={props.time}
//         jobsDone={props.jobsDone}
//         setjobsDone={props.setjobsDone}
//         toggleDetails={toggleDetails}
//       />
//     );
//   }
//   let content;
function test(){
    console.log('here')
    console.log(showContent)
    if (showContent === 'quiz') {
        // console.log('content', showContent)
        return(
        <PersonalityQuiz 
        toggleContent={toggleContent}
        />)}
        else if (showContent === 'summary') {
            // console.log('content', showContent)
            return(
            <SummarizedSidebar driver={props.driver}
            Log={props.Log}
            timeLog={props.timeLog}
            isRunning={props.isRunning}
            time={props.time}
            setTime={props.time}
            jobsDone={props.jobsDone}
            setjobsDone={props.setjobsDone}
            toggleContent={toggleContent} />)
        }
        else if (showContent === 'details') {
        <StatusDetails 
        toggleContent={toggleContent}
        />
    }
    else{
        console.log('here2')
    }
}




  var statusdetails = useState(false);
  var showStatusDetails = () => (statusdetails = !statusdetails);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <nav className="nav-menu active">
          <div>
            {}
            {test()}
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
            {/* {<PersonalityQuiz/>} */}
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
