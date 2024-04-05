import React from 'react';
import { FaCog, FaHome } from 'react-icons/fa';
import { GoListOrdered } from "react-icons/go";
import { GrDeliver } from "react-icons/gr";
import { IoIosPeople } from "react-icons/io";
import { RiLogoutBoxFill } from "react-icons/ri";
import { NavLink } from 'react-router-dom';

const Sidebar = ({sidebarToggle}) => {

  return (
    <div className={`${sidebarToggle? " hidden " : " block "}w-64 bg-[#00084E] fixed h-full px-4 py-2`}>
      <div className='my-2 mb-4'>
        <h1 className='text-xl text-white font-bold'>Creative Freightway <br/>Logistics Pvt Ltd</h1>
      </div>
      <hr/>
      <ul className='navbttns mt-3 text-white font-bold'>
      <NavLink to="">
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
            <a href='' className='px-3'>
                <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'></FaHome>
                Dashboard
            </a>
        </li>
        </NavLink>
        <NavLink to="/cmsystem/customers">
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
            <a href='' className='px-3'>
                <IoIosPeople  className='inline-block w-7 h-7 mr-2 -mt-2'></IoIosPeople >
                Customers
            </a>
        </li>
        </NavLink>
        <NavLink to="/cmsystem/courier">
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
            <a href='' className='px-3'>
                <GrDeliver className='inline-block w-6 h-6 mr-2 -mt-2'></GrDeliver>
                Courier services
            </a>
        </li>
        </NavLink>
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
            <a href='' className='px-3'>
                <GoListOrdered className='inline-block w-6 h-6 mr-2 -mt-2'></GoListOrdered>
                Orders
            </a>
        </li>
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
            <a href='' className='px-3'>
                <FaCog className='inline-block w-6 h-6 mr-2 -mt-2'></FaCog>
                Shipments
            </a>
        </li>
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
            <a href='' className='px-3'>
                <FaCog className='inline-block w-6 h-6 mr-2 -mt-2'></FaCog>
                Reports
            </a>
        </li>
        <NavLink to="/">
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
            <a href='' className='px-3'>
                <RiLogoutBoxFill className='inline-block w-6 h-6 mr-2 -mt-2'></RiLogoutBoxFill>
                Log out
            </a>
        </li>
        </NavLink>
      </ul>
    </div>
  )
}

export default Sidebar
