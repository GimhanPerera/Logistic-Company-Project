import { Box } from '@mui/material';
import axios from "axios";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

//Order card
const OrderDetailsCard = ({ order,removeOrderFromList }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  // Check if courier is defined before trying to access its properties
  if (!order) {
    return null; // or handle the case where courier is undefined/null
  }
  const toPackages = () => {
    if (order.status != 'Just opened') {
      retrun
    }
    const id = order.order_id;
    //console.log("TEST!: ",order.Price_quotation.items, order.Price_quotation.no_of_packages)
    navigate(`./${id}`, { state: { category: order.category, items : order.Price_quotation.items, expectedPackageCount: order.Price_quotation.no_of_packages} });
  }
  const toView = () => {
    navigate('./view', { state: { id: order.order_id } });
  }

  const toUpdateTracking = () => {

    const id = order.order_id;
    navigate('./updatetracking', { state: { orderId: order.order_id, fullname: order.Customer.f_name + " " + order.Customer.l_name, status: order.status, tel_number: order.Customer.tel_number, main_tracking_number: order.main_tracking_number } });
  }

  const toDeleteOrder = () => {
    const orderID = order.order_id;
    console.log("DD: ", orderID)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/api/order/${orderID}`)
          .then((response) => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            setVisible(false);
            removeOrderFromList(orderID);
          })
          .catch((error) => {
            console.error("Error fetching courier details:", error);
          });
        
      }
    });

  }

  if (!visible) return null;

  return (
    <Box component="div"
      sx={{
        width: '50%',
        height: '8rem',
        border: '2px solid',
        marginTop: '0.75rem',
        padding: '0.5rem',
        display: 'flex',
        justifyContent: 'space-between'
      }}
      >
        {/* Order details */}
      <div>
        <div>Order number: {order.order_id}</div>
        <div>Customer ID: {order.Customer.customer_id}</div>
        <div>Customer name: {order.Customer.f_name} {order.Customer.l_name}</div>
        <div>Status: {order.status}</div>
        <div>Category: {order.category}</div>
        <div>Open date: {order.order_open_date.split('T')[0]} {order.order_open_date.split('T')[1].substring(0, 5)}</div>
      </div>
      {/* <Box
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
      </Box> */}
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
          <Box component="p" onClick={toView} sx={{ cursor: 'pointer' }}>View</Box>
          {/* <Box component="p" onClick={toPackages} sx={{cursor:'pointer'}}>add packages</Box> */}
          {order.status == 'Just opened' && (
            <Box component="p" onClick={toPackages} sx={{ cursor: 'pointer' }}>add packages</Box>
          )}
          {order.status == 'Just opened' || order.status == 'FINISH' ? '':
          <Box className='p' onClick={toUpdateTracking} sx={{ cursor: 'pointer' }} >Update tracking</Box> }
          {order.status == 'Just opened' ?
            <Box className='p' onClick={toDeleteOrder} sx={{ cursor: 'pointer' }} >Cancel the order</Box> : <p></p>}
        </Box>
      </div>
    </Box>
  );
};

export default OrderDetailsCard;