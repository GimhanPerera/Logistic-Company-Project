import React from 'react';

const OrderDetailsCard = ({ order }) => {
  // Check if courier is defined before trying to access its properties
  if (!order) {
    return null; // or handle the case where courier is undefined/null
  }

  return (
    <div className='w-2/4 h-32 border-2 mt-3 p-2 flex justify-between'>
        <div>
        <div className="title">Order number: {order.order_id}</div>
        <div className="body">Customer ID: {order.Customer.customer_id}</div>
        <div className="footer">Custoemr name: {order.Customer.f_name} {order.Customer.l_name}</div>
        <div className="footer">Status name: {order.status}</div>
        </div>
        <div className='text-blue-500 flex flex-col justify-end underline'>
            Complete order
        </div>
        <div>
            <div className='text-blue-500 flex flex-col justify-between items-end h-full underline'>
                <p className=''>View</p>
                <p>Add packages</p>
                <p className=''>Update tracking</p>
                <p>Cancel the order</p>
            </div>
        </div>
    </div>
  );
};

export default OrderDetailsCard;