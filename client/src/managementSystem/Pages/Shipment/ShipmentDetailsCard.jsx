import { Box } from '@mui/material';
import axios from "axios";
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ShipmentDetailsCard = ({ shipment }) => {
  const navigate = useNavigate();

  const toDetails = () => {
    const shippingMethod = shipment.shipping_method == 'air' ? 'Air cargo' : 'Ship cargo';
    navigate('./details', { state: { shipment: shipment, shippingMethod: shippingMethod, isNew: false } });
  }
  const toScan = () => {
    axios.get(`http://localhost:3001/api/shipment/getPackagesOf/${shipment.BL_no}`, {
    }).then((response) => {
      console.log(response.data)

      navigate('./scan', { state: { packages: response.data.packages, totalPackageCount: response.data.totalPackageCount, totalCollectedCount: response.data.totalCollectedCount } });
    }).catch((error) => {
      console.error('Error :', error);
    });

  }

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
        <div>Displayed arrival date: {shipment.displayed_arrival_date}</div>
        <div>
          Status: <span style={{ color: shipment.status === 'waiting' ? 'red' : 'green' }}>
            {shipment.status}
          </span>
        </div>
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
            <a onClick={toScan} style={{ cursor: 'pointer' }}>Scan</a>
            <a onClick={toDetails} style={{ marginLeft: '0.75rem', cursor: 'pointer' }}>Edit</a>
            {shipment.status=='waiting'? <a style={{ marginLeft: '0.75rem', cursor: 'pointer' }}>Cancel</a> : ''}
            
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default ShipmentDetailsCard;
