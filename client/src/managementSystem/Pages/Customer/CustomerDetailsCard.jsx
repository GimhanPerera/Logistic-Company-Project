import React from 'react'

const CustomerDetailsCard = ({customer}) => {
  return (
    <div className='w-2/4 h-28 border-2 mt-3 p-2 flex justify-between'>
        <div>
        <div className="title">Customer ID: {customer.customer_id}</div>
        <div className="body">Name: {customer.f_name} {customer.l_name}</div>
        <div className="footer">Tel number: 0{customer.tel_number}</div>
        </div>
        <div className='text-blue-500 flex flex-col justify-end underline'>
            1 active order
        </div>
        <div>
            <div className='text-blue-500 flex flex-col justify-between items-end h-full underline'>
                <p className='cursor-pointer'>New order</p>
                <p className='cursor-pointer'>Edit</p>
                <p className='cursor-pointer'>Delete</p>
                <p className='cursor-pointer'>History</p>
            </div>
        </div>
    </div>
  )
}

export default CustomerDetailsCard
