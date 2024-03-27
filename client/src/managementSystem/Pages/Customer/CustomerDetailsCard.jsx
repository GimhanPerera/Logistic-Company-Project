import React from 'react'

const CustomerDetailsCard = ({customer}) => {
  return (
    <div className='w-2/4 h-24 border-2 mt-3 p-2 flex justify-between'>
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
                <p className=''>New order</p>
                <p>History</p>
            </div>
        </div>
    </div>
  )
}

export default CustomerDetailsCard
