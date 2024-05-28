import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./navbar";
import OrderCard from "./orderCard";

export const AllMyOrders = () => {
  const navigate = useNavigate();
  const [reqCount,setReqCount]=useState(0);
  const toBack = () => {
    navigate('../');
  }
  const orderRequest = () => {
    console.log("REQ COUNT:"+reqCount)
    if(reqCount<2){
      navigate('./request');
      return
    }
    toast.error("Maximum of 2 orders requests can be send at once");
    
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
      setReqCount(listOfOrders.filter(order => order.status === 'Request').length);
      console.log("COUNT ",listOfOrders.filter(order => order.status === 'Request').length)
    })
  }, [])

  return (
    <>
    <ToastContainer />
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
        <Button variant="outlined"
          onClick={orderRequest}>
          Order Request
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
