import axios from 'axios';
import React from 'react';

const CourierDetailsCard = ({ courier,reload,clickEdit }) => {

  const deleteCourier = () => {
    axios.delete(`http://localhost:3001/api/courier/${courier.courier_id}`)
    .then((response) => {
        reload;
        console.log("Not worked")
    })
    .catch((error) => {
        console.error("Error fetching courier details:", error);
    });
  }
  const handleEditClick = () => {
    clickEdit(courier.courier_id)
  }

  // Check if courier is defined before trying to access its properties
  if (!courier) {
    return null; // or handle the case where courier is undefined/null
  }

  return (
    <div className='w-2/4 h-24 border-2 mt-3 p-2 flex justify-between'>
      <div>
        <div className="title">Courier ID: {courier.courier_id}</div>
        <div className="body">Name: {courier.name}</div>
        <div className="footer">Tel number: 0{courier.tel_number}</div>
      </div>
      <div>
        <div className='text-blue-500 flex flex-col justify-between items-end h-full underline'>
          <p className='cursor-pointer'>History</p>
          <p className='cursor-pointer' onClick={handleEditClick}>Edit</p>
          <p className='text-red-600 underline cursor-pointer' onClick={deleteCourier}>Delete</p>
        </div>
      </div>
    </div>
  );
};

export default CourierDetailsCard;
