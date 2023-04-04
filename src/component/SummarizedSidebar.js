import React from 'react'
import * as IoIcons from "react-icons/io5";
// import Button from '@mui/material/Button';
import { Button } from '@mantine/core'; 



export function SummarizedSidebar() {
    return (
        <div>
            <ul className='nav-menu-items'>
                <div className='nav-header'>
                    <span> STATUS </span>
                </div>

                <div className='nav-subheader'>
                    <span> Globals: </span>
                </div>
            
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

                <div className='padding-subheader'>
                    <span> </span>
                </div>

                <div className='nav-subheader'>
                    <span> Drivers' States: </span>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoPerson />
                        <span>You:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoCarOutline />
                        <span>Type A:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoCarOutline />
                        <span>Type B:</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoCarOutline />
                        <span>Type C:</span>
                    </div>
                </div>
                {/* <div className='nav-button'>
                <Button variant="contained" color='primary'>see details</Button>
                </div> */}
            <div className='nav-text'>
                <span> __________________ </span>
            </div>
            
            
            <div className='padding-subheader'>
                    <span> </span>
                </div>


            <div className='nav-header'>
                <span> STATISTICS </span>
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
                <div className='nav-button'>
                <Button variant="contained" color='primary'>see details</Button>
                </div>
            </ul>
        </div>
    )
}


