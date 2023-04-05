import React from 'react'
import * as IoIcons from "react-icons/io5";

export function StatusDetails() {
    return (
        <div>
            <ul className='nav-menu-items'>
                <div className='nav-text'>
                    <IoIcons.IoArrowBackOutline /> 
                    <span></span>
                </div>
                <div className='padding-subheader'>
                    <span> </span>
                </div>
                <div className='nav-header'>
                    <span>DETAILS</span>
                </div>

                <div className='nav-subheader'>
                    <span> Your Profit: </span>
                </div>

                <div className='nav-subheader'>
                    <span> put graphs here: </span>
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
                        <span>Time:</span>
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
                    <IoIcons.IoFlashOutline />
                        <span>Fuel Cost:</span>
                    </div>
                </div>

                <div className='nav-text'>
                    <div>
                    <IoIcons.IoWalletOutline />
                        <span>Fare/Km:</span>
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
                        <span>Total:</span>
                </div>
                <div className='nav-text'>
                        <IoIcons.IoHourglassOutline />
                        <span>Waiting:</span>
                </div>
                <div className='nav-text'>
                        <IoIcons.IoCarSportOutline />
                        <span>Transit:</span>
                </div>

            <div className='nav-text'>
                <span> __________________ </span>
            </div>
            
            
            
            </ul>
        </div>
    )
}
