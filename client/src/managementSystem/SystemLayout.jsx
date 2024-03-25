import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const SystemLayout = ({sidebarToggle, setSidebarToggle}) => {
  return (
    <div className={`${sidebarToggle ? "" : " ml-64 "} w-full`}>
      <Navbar
      sidebarToggle={sidebarToggle}
      setSidebarToggle={setSidebarToggle}/>
      <Outlet/>
      
    </div>
  )
}

export default SystemLayout
