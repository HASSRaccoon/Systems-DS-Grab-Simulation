import React from 'react'
import * as IoIcons from "react-icons/io5";
import { Button } from "@mantine/core";
import "./Sidebar.css";

export function StatusDetails(props) {


    return (
        <div>
            <ul className='nav-menu-items'>
                <div className='nav-text'>
                    <Button onClick={props.handleRenderDetails} color='cyan'><IoIcons.IoArrowBackOutline/> BACK <span></span> </Button>
                    
                    
                </div>
                <div className='padding-subheader'>
                    <span> </span>
                </div>
                <div className='nav-header'>
                    <span>DETAILS</span>
                </div>

                <div className='nav-subheader'>
                    <span> Live Profit Comparison: </span>
                </div>
                <div className='padding-subheader'></div>

                <div className='nav-graph'>
                    <img src= './dummy-graph.jpeg'width = '300px' ></img>
                </div>

                <div className='padding-aftergraph'></div>

                <div className='nav-text'>
                        <IoIcons.IoWalletOutline />
                        <span>Your profit: $382</span>
                </div>
                <div className='nav-text'>
                        <IoIcons.IoWalletOutline />
                        <span>Average profit: $375</span>
                </div>
                <span></span>

                <div className='nav-subheader'>
                    <span> Globals: </span>
                </div>
            
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoCalendarClearOutline />
                        <span>Day: 1</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoTimeOutline />
                        <span>Time: 6:25 PM</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                        <IoIcons.IoAlarmOutline />
                        <span>Peak hour: True</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                    <IoIcons.IoRainyOutline />
                        <span>Weather: Dry</span>
                    </div>
                </div>
                <div className='nav-text'>
                    <div>
                    <IoIcons.IoFlashOutline />
                        <span>Fuel Cost: $2.63/l</span>
                    </div>
                </div>

                <div className='nav-text'>
                    <div>
                    <IoIcons.IoWalletOutline />
                        <span>Fare/Km: $1.53/Km</span>
                    </div>
                </div>

                <div className='padding-subheader'>
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

                <div className='nav-subheader'>
                    <span> Passengers: </span>
                </div>
                <div className='nav-text'>
                        <IoIcons.IoPeopleOutline />
                        <span>Total: 18</span>
                </div>
                <div className='nav-text'>
                        <IoIcons.IoHourglassOutline />
                        <span>Waiting: 15</span>
                </div>
                <div className='nav-text'>
                        <IoIcons.IoCarSportOutline />
                        <span>Transit: 3</span>
                </div>


            
            
            
            </ul>
        </div>
    )
}
