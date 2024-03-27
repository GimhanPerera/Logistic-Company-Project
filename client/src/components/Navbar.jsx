import React from 'react'
import { FaBars, FaUserCircle } from 'react-icons/fa'

const Navbar = ({sidebarToggle, setSidebarToggle}) => {
  return (
    <nav className='bg-[#00084E] px-4 py-3 flex justify-between'>
      <div className='flex items-center text-xl'>
        <FaBars className='text-white me-4 cursor-pointer' onClick={() => setSidebarToggle(!sidebarToggle)}/>
        <span className='text-white font-semibold'>Dashboard</span>
      </div>
      <div className='flex items-center gap-x-5'>
        
        <div className='relative flex gap-6 items-center'>
          <p className='text-white '>Welcome, Gimhan</p>
            <button className='text-white group'>
                <FaUserCircle className='w-7 h-7 mt-1'/>
                <div className='z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus:block top-full right-0'>
                    <ul className='py-2 text-sm text-gray-950'>
                        <li><a href=''>Profile</a></li>
                        <li><a href=''>Setting</a></li>
                        <li><a href=''>Log out</a></li>
                    </ul>
                </div>
            </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
