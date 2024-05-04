import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import SystemLayout from './SystemLayout';

function ManagmentSystem() {
  const [sidebarToggle, setSidebarToggle] = useState(false)

  const [value, setValue] = useState('Dashboard');//Name text of the navigation bar
  const handleChangeValue = (newValue) => {
    setValue(newValue);
  };
  return (
    <div style={{ display: 'flex' }}>

      <Sidebar sidebarToggle={sidebarToggle} handleChangeValue={handleChangeValue} />
      <div ></div>
      <SystemLayout
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        value={value} />

    </div>
  )
}

export default ManagmentSystem