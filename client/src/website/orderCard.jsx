import React from 'react'

const OrderCard = ({orders}) => {
  return (
    <div className='w-2/4 h-24 border-2 mt-3 p-2 flex justify-between'>
        <div>
        <div className="title">Order ID: {orders.order_id}</div>
        <div className="body">Tracking number: {orders.main_tracking_number}</div>
        <div className="footer">Status: 0{orders.status}</div>
        </div>
        <div className='text-blue-500 flex flex-col justify-end underline'>
            1 active order
        </div>
        <div>
            <div className='text-blue-500 flex flex-col justify-between items-end h-full underline'>
                <p className=''>New order</p>
                <p>History</p>
            </div>
        </div>
    </div>
  )
}

export default OrderCard