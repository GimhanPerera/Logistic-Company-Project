import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const SystemLayout = ({ sidebarToggle, setSidebarToggle, value }) => {
  return (
    <div style={{ width: '100%', ...(sidebarToggle ? {} : { marginLeft: '16rem' }) }}>
      <Navbar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        value={value} />

      {/* For resole the fixed effect of Nav bar */}
      <div style={{ paddingTop: '5rem' }} />
      <Outlet />

    </div>
  )
}

export default SystemLayout
