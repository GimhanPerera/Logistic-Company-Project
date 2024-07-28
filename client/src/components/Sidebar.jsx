import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { FaPeopleRoof } from "react-icons/fa6";
import { GoListOrdered } from "react-icons/go";
import { GrDeliver } from "react-icons/gr";
import { IoIosPeople } from "react-icons/io";
import { MdRequestQuote } from "react-icons/md";
import { PiShippingContainerFill } from "react-icons/pi";
import { RiLogoutBoxFill, RiStickyNoteFill } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { NavLink } from 'react-router-dom';

//side bar of the management system
const Sidebar = ({ sidebarToggle, handleChangeValue }) => {

    const [currentUser, setCurrentUser] = useState(undefined);//current user
    
    //identify the current user
    useEffect(() => {
        const userRole = localStorage.getItem("user");
        if (userRole) {
            const parsedUserRole = JSON.parse(userRole); // Parse the string into an object
            setCurrentUser(parsedUserRole.role);
        }
    }, []);

    //Handle click of nav buttons
    const handleClick = (display_name) => {
        handleChangeValue(display_name);
    };

    return (
        <Box style={{
            width: '16rem',
            backgroundColor: '#00084E',
            position: 'fixed',
            height: '100%',
            padding: '0.5rem 1rem',
            ...(sidebarToggle ? { display: 'none' } : { display: 'block' })
        }}>{/* Company name area */}
            <Box component="div" style={{ margin: '0.5rem 0rem 0rem 1rem' }}>
                <Box component="h1"
                    sx={{
                        fontSize: '1.25rem', // Equivalent to text-xl in Tailwind
                        color: 'white', // Equivalent to text-white in Tailwind
                        fontWeight: 'bold' // Equivalent to font-bold in Tailwind
                    }}>
                    Creative Freightway <br />Logistics Pvt Ltd
                </Box>
            </Box>
            <hr />

            {/* Navigation buttons */}
            <Box component="ul"
                sx={{
                    mt: '0.75rem',
                    color: 'white',
                    fontWeight: 'bold'
                }}
            >
                {/* Dashboard button */}
                <NavLink to="" onClick={() => handleClick('Dashboard')}>
                    <li
                        style={{
                            marginBottom: '1rem',
                            color: 'white',
                            listStyleType: 'none',
                            marginTop: '2rem' // Remove bullet points
                        }}
                    >
                        <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                            <FaHome style={{ marginRight: '0.6rem' }}></FaHome>
                            Dashboard
                        </a>
                    </li>
                </NavLink>

                {/* Quotation requests button */}
                <NavLink to="/cmsystem/requests" onClick={() => handleClick('Price quotation requests')}>
                    <li
                        style={{
                            marginBottom: '1rem',
                            color: 'white',
                            listStyleType: 'none' // Remove bullet points
                        }}
                    >
                        <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                            <MdRequestQuote style={{ marginRight: '0.6rem' }}></MdRequestQuote >
                            Quotation Requests
                        </a>
                    </li>
                </NavLink>

                {/* Orders button */}
                <NavLink to="/cmsystem/order" onClick={() => handleClick('Orders')}>
                    <li
                        style={{
                            marginBottom: '1rem',
                            color: 'white',
                            listStyleType: 'none' // Remove bullet points
                        }}
                    >
                        <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                            <GoListOrdered style={{ marginRight: '0.6rem' }}></GoListOrdered>
                            Orders
                        </a>
                    </li>
                </NavLink>

                {/* Shipments button */}
                <NavLink to="/cmsystem/shipment" onClick={() => handleClick('Shipments')}>
                    <li
                        style={{
                            marginBottom: '1rem',
                            color: 'white',
                            listStyleType: 'none' // Remove bullet points
                        }}
                    >
                        <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                            <PiShippingContainerFill style={{ marginRight: '0.6rem' }}></PiShippingContainerFill>
                            Shipments
                        </a>
                    </li>
                </NavLink>

                {/* Customers button */}
                <NavLink to="/cmsystem/customers" onClick={() => handleClick('Customers')}>
                    <li
                        style={{
                            marginBottom: '1rem',
                            color: 'white',
                            listStyleType: 'none' // Remove bullet points
                        }}
                    >
                        <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                            <IoIosPeople style={{ marginRight: '0.6rem' }}></IoIosPeople >
                            Customers
                        </a>
                    </li>
                </NavLink>
                
                {/* Employee button: Only visible to Admin and manager */}
                {['ADMIN', 'MANAGER'].includes(currentUser) && (
                    <NavLink to="/cmsystem/employee" onClick={() => handleClick('Employees')}>
                        <li
                            style={{
                                marginBottom: '1rem',
                                color: 'white',
                                listStyleType: 'none' // Remove bullet points
                            }}
                        >
                            <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                                <FaPeopleRoof style={{ marginRight: '0.6rem' }}></FaPeopleRoof>
                                Employees
                            </a>
                        </li>
                    </NavLink>
                )}

                {/* Courier serviers button */}
                <NavLink to="/cmsystem/courier" onClick={() => handleClick('Courier services')}>
                    <li
                        style={{
                            marginBottom: '1rem',
                            color: 'white',
                            listStyleType: 'none' // Remove bullet points
                        }}
                    >
                        <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                            <GrDeliver style={{ marginRight: '0.6rem' }}></GrDeliver>
                            Courier services
                        </a>
                    </li>
                </NavLink>

                {/* Specail notices button: Only visible to admin */}
                {currentUser == 'ADMIN' && (
                    <NavLink to="/cmsystem/SpecialNotices" onClick={() => handleClick('Special Notices')}>
                        <li
                            style={{
                                marginBottom: '1rem',
                                color: 'white',
                                listStyleType: 'none' // Remove bullet points
                            }}
                        >
                            <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                                <RiStickyNoteFill style={{ marginRight: '0.6rem' }}></RiStickyNoteFill>
                                Special Notices
                            </a>
                        </li>
                    </NavLink>
                )}

                {/* Complain and report button: Only visible to admin and manager */}
                {['ADMIN', 'MANAGER'].includes(currentUser) && (
                    <>
                        <NavLink to="/cmsystem/complain" onClick={() => handleClick('Complains')}>
                            <li
                                style={{
                                    marginBottom: '1rem',
                                    color: 'white',
                                    listStyleType: 'none' // Remove bullet points
                                }}
                            >
                                <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                                    <GoListOrdered style={{ marginRight: '0.6rem' }}></GoListOrdered>
                                    Complains
                                </a>
                            </li>
                        </NavLink>

                        <NavLink to="/cmsystem/reports" onClick={() => handleClick('Reports')}>
                            <li
                                style={{
                                    marginBottom: '1rem',
                                    color: 'white',
                                    listStyleType: 'none' // Remove bullet points
                                }}
                            >
                                <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                                    <TbReportAnalytics style={{ marginRight: '0.6rem' }}></TbReportAnalytics>
                                    Reports
                                </a>
                            </li>
                        </NavLink>
                    </>
                )}
                {/* Logout button */}
                <NavLink to="/" onClick={() => {
                    localStorage.removeItem('user');//remove user
                }}>
                    <li
                        style={{
                            marginBottom: '0.6rem',
                            color: 'white',
                            listStyleType: 'none' // Remove bullet points
                        }}
                    >
                        <a href='' style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} >
                            <RiLogoutBoxFill style={{ marginRight: '0.6rem' }}></RiLogoutBoxFill>
                            Log out
                        </a>
                    </li>
                </NavLink>
            </Box>
        </Box>
    )
}

export default Sidebar
