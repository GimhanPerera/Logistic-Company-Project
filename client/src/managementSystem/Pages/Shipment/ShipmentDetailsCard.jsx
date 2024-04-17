import React from 'react';

const ShipmentDetailsCard = ({ shipment }) => {
  // Check if courier is defined before trying to access its properties
  if (!shipment) {
    return null; // or handle the case where courier is undefined/null
  }
  const orderIds = shipment.Orders.map(order => order.order_id);

  return (
    <div className='w-2/4 h-32 border-2 mt-3 p-2 flex justify-between'>
      <div>
        <div>BL number: {shipment.BL_no}</div>
        <div>Shipping method: {shipment.shipping_method}</div>
        <div>Displayed arrival date: {shipment.desplayed_arriveal_date}</div>
        <div >Orders: {orderIds.join(', ')}</div>
      </div>
      <div>
        <div className='flex flex-col justify-between items-end h-full'>
            <div>Loaded date: {shipment.loaded_date}</div>
            <div>Arrival date: {shipment.arrival_date}</div>
            <div className='text-blue-500 h-full underline'>
                <a className='ml-3'>Scan</a>
                <a className='ml-3'>Edit</a>
                <a className='ml-3'>Cancel</a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsCard;
