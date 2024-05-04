import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/SearchBar";
import OrderDetailsCard from "./orderDetailsCard";

const OrderDetails = () => {
  const navigate = useNavigate();
  const [listOfOrderDetails, setListOfOrder] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/api/order").then((response) => {
      setListOfOrder(response.data);
    })
  }, [])

  const toNewOrder = () => {
    navigate('../neworder');
  }

  return (
    <div className="relative">
      <SearchBar />
      <Button variant="contained"
        sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }}
        onClick={toNewOrder}>
        New Order
      </Button>
      {/* key kiyanne index in the array */}
      {listOfOrderDetails.map((order, index) => (
        <Box component="div" key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <OrderDetailsCard order={order} />
        </Box>
      ))}
    </div>
  )
}

export default OrderDetails