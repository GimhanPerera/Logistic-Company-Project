import { Box } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderDetailsCard = ({ order }) => {
  const navigate = useNavigate();
  
  // Check if courier is defined before trying to access its properties
  if (!order) {
    return null; // or handle the case where courier is undefined/null
  }
  const toPackages = () => {
    const id=order.order_id;
    navigate(`./${id}`);
  }

  return (
    <Box component="div"
      sx={{
        width: '50%',
        height: '7rem',
        border: '2px solid',
        marginTop: '0.75rem',
        padding: '0.5rem',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
      <div>
        <div>Order number: {order.order_id}</div>
        <div>Customer ID: {order.Customer.customer_id}</div>
        <div>Custoemr name: {order.Customer.f_name} {order.Customer.l_name}</div>
        <div>Status: {order.status}</div>
      </div>
      <Box
        component="div"
        sx={{
          color: '#3B82F6',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          textDecoration: 'underline'
        }}
      >
        Complete order
      </Box>
      <div>
        <Box
          component="div"
          sx={{
            color: '#3B82F6',
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: '100%',
            textDecoration: 'underline'
          }}
        >
          <p className=''>View</p>
          <Box component="p" onClick={toPackages} sx={{cursor:'pointer'}}>packages</Box>
          <p className=''>Update tracking</p>
          <p>Cancel the order</p>
        </Box>
      </div>
    </Box>
  );
};

export default OrderDetailsCard;