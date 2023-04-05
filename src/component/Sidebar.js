import React, {useState} from 'react'
import * as IoIcons from "react-icons/io5";
import { Link } from 'react-router-dom';
import { SummarizedSidebar } from './SummarizedSidebar';
import './Sidebar.css';
import { IconContext } from 'react-icons'; 
import { Button } from '@mantine/core';
// import Button from '@mui/material/Button';
import { StatusDetails } from './StatusDetails';
import { PersonalityQuiz } from './PersonalityQuiz';

function Sidebar() {
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

    var statusdetails = useState(false)
    var showStatusDetails = () => statusdetails = !statusdetails

    return (
    <>
        <IconContext.Provider value={{color: '#fff'}}>
        <nav className= 'nav-menu active'>
            <div>
                {/* <SummarizedSidebar /> */}
                {/* {<PersonalityQuiz/>} */}
                <StatusDetails />

            </div>
        </nav>



        {/* <div className='ffw-button'>
                <Button variant="contained" color='primary'>
                    
                    <IoIcons.IoPlayForwardOutline /><span className='ffw-text'> FFW </span>
                </Button>
        </div> */}
        </IconContext.Provider>
    </>
    )
}

export default Sidebar
 