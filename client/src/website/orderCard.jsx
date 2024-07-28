import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ orders }) => {
  const navigate = useNavigate();
  const [id, setId] = useState(orders.main_tracking_number);//order tracking number

  //view more button
  const viewDetails = () => {
    navigate(`./${id}`);
  }

  //set date format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${formattedDate} ${hours}:${minutes}`;
  };

  return (
    <Box component="div"
      sx={{
        width: '600px',
        height: '7rem',
        borderWidth: '2px',
        marginTop: '0.75rem',
        padding: '0.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        borderStyle: 'solid'
      }}
    >
      {/* Left side row */}
      <Box component="div"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          height: '100%'
        }}
      >

        {/* Order number */}
        <Box component="div"
          sx={{
            fontWeight: 'bold',
            width: '300px',
            marginBottom: '0.5rem'
          }}>
          Order number: {orders.order_id}
        </Box>

        {/* Tracking number */}
        <Box
          sx={{
            width: '300px',
            marginBottom: '0.5rem'
          }}>Tracking number: {orders.main_tracking_number}</Box>

        {/* Status */}
        <Box
          sx={{
            width: '300px',
            marginBottom: '0.5rem'
          }}>Status: {orders.status}</Box>

        {/* Country */}
        <Box
          sx={{
            width: '300px',
          }}>From: {orders.supplier_loc}</Box>
      </Box>

      {/* Right side row */}
      <Box component="div"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          height: '100%'
        }}>

          {/* Order open date */}
        <div>Order open date: {formatDate(orders.order_open_date).substring(0, 10)}</div>
        {/* Order expecting receiving date  */}
        {orders.Shipment ? (
          <p>Expecting receiving date: {orders.Shipment.displayed_arrival_date}</p>
        ) : (<p>Expecting receiving date: -</p>)}
        <Box component="div"
          sx={{
            color: '#4299e1',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            textDecoration: 'underline'
          }}
        >
          {/* View more button */}
          {orders.status == 'Request' ? '' :
            <a onClick={viewDetails} style={{ cursor: 'pointer' }}>View more</a>
          }
        </Box>
      </Box>
    </Box>
  )
}

export default OrderCard