import React from 'react'

const OrderCard = ({orders}) => {
  return (
    <div className='w-2/4 h-28 border-2 mt-3 p-2 flex justify-between'>
        <div>
          <div className="title font-bold">Order number: {orders.order_id}</div>
          <div>Tracking number: {orders.main_tracking_number}</div>
          <div>Status: {orders.status}</div>
          <div>From: {orders.supplier_loc}</div>
        </div>
        
        <div className=' flex flex-col justify-between items-end h-full'>
            <div>Order open date: {orders.order_open_date}</div>
            {orders.Shipment ? (
              <p>Expecting receiving date: {orders.Shipment.desplayed_arriveal_date}</p>
            ) : (<p>Expecting receiving date: -</p>)}
            <div className='text-blue-500 flex flex-row justify-end underline'>
              <a className='mr-4'>Give feedback</a>
              <a>View more</a>
            </div>
            </div>
    </div>
  )
}

export default OrderCard