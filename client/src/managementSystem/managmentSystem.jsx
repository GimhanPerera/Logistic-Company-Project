import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import SystemLayout from './SystemLayout'

function ManagmentSystem() {
  const [sidebarToggle, setSidebarToggle] = useState(false)

  return (
    <div className='flex'>
      <Sidebar sidebarToggle={sidebarToggle}/>
      <SystemLayout
      sidebarToggle={sidebarToggle}
      setSidebarToggle={setSidebarToggle}/>
      
    </div>
  )
}

export default ManagmentSystem