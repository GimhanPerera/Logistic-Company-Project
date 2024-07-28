import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import SystemLayout from './SystemLayout';

//Side bar and pages
function ManagmentSystem() {
  const [sidebarToggle, setSidebarToggle] = useState(false)

  const [value, setValue] = useState('Dashboard');//Name text of the navigation bar
  const handleChangeValue = (newValue) => {
    setValue(newValue);
  };
  return (
    <div style={{ display: 'flex' }}>

      {/* Side bar */}
      <Sidebar sidebarToggle={sidebarToggle} handleChangeValue={handleChangeValue} />
      <div ></div>

      {/* Pages display here */}
      <SystemLayout
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        value={value} />

    </div>
  )
}

export default ManagmentSystem