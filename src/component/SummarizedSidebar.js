import React from 'react'
import * as IoIcons from "react-icons/io5";
// import Button from '@mui/material/Button';
import { Button } from '@mantine/core'; 
import './Sidebar.css';



export function SummarizedSidebar() {
    return (
        <div>
            <ul className='nav-menu-items'>
                <div className='nav-header'>
                    <span> STATUS </span>
                </div>

                    {/* <div className='nav-subheader'>
                        <span> Globals: </span>
                    </div> */}
            
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoCalendarClearOutline />
                        <span>Day:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoTimeOutline />
                        <span>Time</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoAlarmOutline />
                        <span>Peak hour:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                    <IoIcons.IoRainyOutline />
                        <span>Weather:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoPerson />
                        <span>Your state:</span>
                    </div>
                </div>

                <div className='nav-text'>
                ______________________ 
            </div>

                <div className='padding-subheader'>
                    <span> </span>
                </div>

                <div className='nav-header'>
                    <span> INPUTS </span>
                </div>
                
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoCarOutline />
                        <span>Work period:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoRestaurantOutline />
                        <span>Rest period:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoFlashOutline/>
                        <span>Speed:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoHourglassOutline />
                        <span>Wait behavior:</span>
                    </div>
                </div>
                {/* <div className='nav-button'>
                <Button variant="contained" color='primary'>see details</Button>
                </div> */}
            <div className='nav-text'>
                 ______________________ 
            </div>
            
            
            <div className='padding-subheader'>
                    <span> </span>
                </div>


            <div className='nav-header'>
                <span> OUTPUTS </span>
            </div>

            <div className='nav-subheader'>
                    <span> You: </span>
                </div>
            
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoCheckmark />
                        <span>Jobs done:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoWalletOutline />
                        <span>Total profit:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoNavigateOutline/>
                        <span>Total Distance:</span>
                    </div>
                </div>

                <div className='padding-subheader'>
                    <span> </span>
                </div>
                <div className='nav-subheader'>
                    <span> Average: </span>
                </div>
            
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoCheckmark />
                        <span>Jobs done:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoWalletOutline />
                        <span>Total profit:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoNavigateOutline/>
                        <span>Total Distance:</span>
                    </div>
                </div>
                <div className='details-button'>
                <Button color='cyan' >
                    SEE DETAILS<span></span></Button>
                </div>
                {/* <div className='nav-button'>
                <Button variant="contained" color='primary'>see details</Button>
                </div> */}
            </ul>
        </div>
    )
}


