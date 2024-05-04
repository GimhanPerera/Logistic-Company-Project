import { Box } from '@mui/material';
import React from 'react';
import { FaCog, FaHome } from 'react-icons/fa';
import { GoListOrdered } from "react-icons/go";
import { GrDeliver } from "react-icons/gr";
import { IoIosPeople } from "react-icons/io";
import { RiLogoutBoxFill } from "react-icons/ri";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ sidebarToggle, handleChangeValue }) => {

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
        }}>
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
            <Box component="ul"
                sx={{
                    marginTop: '0.75rem',
                    color: 'white',
                    fontWeight: 'bold'
                }}
            >
                <NavLink to="" onClick={() => handleClick('Dashboard')}>
                    <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                        <a href='' className='px-3'>
                            <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'></FaHome>
                            Dashboard
                        </a>
                    </li>
                </NavLink>
                <NavLink to="/cmsystem/customers" onClick={() => handleClick('Customers')}>
                    <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                        <a href='' className='px-3'>
                            <IoIosPeople className='inline-block w-7 h-7 mr-2 -mt-2'></IoIosPeople >
                            Customers
                        </a>
                    </li>
                </NavLink>
                <NavLink to="/cmsystem/courier" onClick={() => handleClick('Courier services')}>
                    <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                        <a href='' className='px-3'>
                            <GrDeliver className='inline-block w-6 h-6 mr-2 -mt-2'></GrDeliver>
                            Courier services
                        </a>
                    </li>
                </NavLink>
                <NavLink to="/cmsystem/order" onClick={() => handleClick('Orders')}>
                    <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                        <a href='' className='px-3'>
                            <GoListOrdered className='inline-block w-6 h-6 mr-2 -mt-2'></GoListOrdered>
                            Orders
                        </a>
                    </li>
                </NavLink>
                <NavLink to="/cmsystem/shipment" onClick={() => handleClick('Shipments')}>
                    <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                        <a href='' className='px-3'>
                            <FaCog className='inline-block w-6 h-6 mr-2 -mt-2'></FaCog>
                            Shipments
                        </a>
                    </li>
                </NavLink>
                <NavLink to="/cmsystem/reports" onClick={() => handleClick('Reports')}>
                    <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                        <a href='' className='px-3'>
                            <FaCog className='inline-block w-6 h-6 mr-2 -mt-2'></FaCog>
                            Reports
                        </a>
                    </li>
                </NavLink>
                <NavLink to="/">
                    <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                        <a href='' className='px-3'>
                            <RiLogoutBoxFill className='inline-block w-6 h-6 mr-2 -mt-2'></RiLogoutBoxFill>
                            Log out
                        </a>
                    </li>
                </NavLink>
            </Box>
        </Box>
    )
}

export default Sidebar
