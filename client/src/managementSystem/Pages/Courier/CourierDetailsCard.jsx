import React from 'react';

const CourierDetailsCard = ({ courier }) => {
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
          <p>History</p>
          <p className=''>Edit</p>
          <p>Delete</p>
        </div>
      </div>
    </div>
  );
};

export default CourierDetailsCard;
