import { Box, Button } from '@mui/material';
import axios from "axios";
import React from 'react';
import { useNavigate } from "react-router-dom";

const OrderRequestCard = ({ priceQ }) => {
  const navigate = useNavigate();

  const viewOrEdit = () => {
    const items = priceQ.items;
    const packCount = priceQ.no_of_packages;
    const shipping_method = priceQ.shipping_method;
    axios.get(`http://localhost:3001/api/priceQuotationRouter/searchby/id/${priceQ.quotation_id}`, {
    }).then((response) => {
      const raugh_weight = response.data.priceReq[0].raugh_weight;
      const description = response.data.priceReq[0].description;
      const supplierLoc = response.data.order[0].supplier_loc;

      navigate(`./${priceQ.quotation_id}`, { state: { order_id: priceQ.order_id, quotation_id: priceQ.quotation_id,itemsP: items, packCountP: packCount, weightP: raugh_weight, shippingMarkP: shipping_method, desP: description, countryP: supplierLoc, imageP: "", performaInvoiceP: "" } });

    }).catch((error) => {
      console.error('Error :', error);
    });
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
          <div className="">Quotation ID: {priceQ.quotation_id}</div>
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
