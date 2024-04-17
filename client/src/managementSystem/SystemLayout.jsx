import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const SystemLayout = ({sidebarToggle, setSidebarToggle, value }) => {
  return (
    <div className={`${sidebarToggle ? "" : " ml-64 "} w-full`}>
      <Navbar
      sidebarToggle={sidebarToggle}
      setSidebarToggle={setSidebarToggle}
      value={value} />
      <Outlet/>
      
    </div>
  )
}

export default SystemLayout
