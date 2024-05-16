import { Box, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from "react-router-dom";

const OrderRequestCard = ({priceQ}) => {
  const navigate = useNavigate();
  const viewOrEdit = () =>{
    navigate(`./${priceQ.quotation_id}`);
  }
  return (
    <>
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
        <div className="">Customer ID: {priceQ.order_id.substring(0, 6)}</div>
        <div className="">Items: {priceQ.items}</div>
        <div className="">Package count: {priceQ.no_of_packages}</div>
        <div className="">Shipping mathod: {priceQ.shipping_method}</div>
      </div>
      <Box>
      </Box>
      <div>
        <Box component="div"
          sx={{
            color: '#3b82f6',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: '100%',
            textDecoration: 'underline'
          }}
        >
          <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }} onClick={viewOrEdit}>View/edit</Button>
          <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }}>Delete</Button>
        </Box>
      </div>
    </Box>
    </>
  )
}

export default OrderRequestCard
