import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./navbar";
import OrderCard from "./orderCard";

export const AllMyOrders = () => {
  const navigate = useNavigate();
  const toBack = () => {
    navigate('../');
  }
  const [listOfOrders, setListOfOrders] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("http://localhost:3001/api/order/myTrackingDetails", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setListOfOrders(response.data);
    })
  }, [])

  return (
    <>
      <Navbar />
      <Box component="div"
        sx={{
          display: 'grid',
          justifyContent: 'center'
        }}>
        <Button variant="outlined"
          onClick={toBack}>
          Log out
        </Button>
        {/* key kiyanne index in the array */}
        {listOfOrders.map((orders, index) => (
          <Box component="div"
            key={index} sx={{ width: '100%' }}>
            <OrderCard orders={orders} />
          </Box>
        ))}
      </Box>
    </>
  )

}

//export default AllMyOrders;
