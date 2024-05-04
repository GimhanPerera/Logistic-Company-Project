import { Box } from '@mui/material';
import React from 'react';
const ShipmentDetailsCard = ({ shipment }) => {
  // Check if courier is defined before trying to access its properties
  if (!shipment) {
    return null; // or handle the case where courier is undefined/null
  }
  const orderIds = shipment.Orders.map(order => order.order_id);

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
        <div>BL number: {shipment.BL_no}</div>
        <div>Shipping method: {shipment.shipping_method}</div>
        <div>Displayed arrival date: {shipment.desplayed_arriveal_date}</div>
        <div >Orders: {orderIds.join(', ')}</div>
      </div>
      <div>
      <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: '100%'
      }}
    >
            <div>Loaded date: {shipment.loaded_date}</div>
            <div>Arrival date: {shipment.arrival_date}</div>
            <Box
      component="div"
      sx={{
        color: '#3B82F6',
        textDecoration: 'underline',
      }}
    >
                <a style={{cursor:'pointer'}}>Scan</a>
                <a style={{marginLeft:'0.75rem', cursor:'pointer'}}>Edit</a>
                <a style={{marginLeft:'0.75rem', cursor:'pointer'}}>Cancel</a>
            </Box>
        </Box>
      </div>
    </Box>
  );
};

export default ShipmentDetailsCard;
