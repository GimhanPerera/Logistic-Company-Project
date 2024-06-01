import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Autheader from "../services/Autheader";
import Navbar from "./navbar";
import OrderCard from "./orderCard";
export const AllMyOrders = () => {
  const navigate = useNavigate();
  const [reqCount,setReqCount]=useState(0);
  const toBack = () => {
    localStorage.removeItem('user')
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
    axios.get("http://localhost:3001/api/order/myTrackingDetails", {
        headers: Autheader()
    }).then((response) => {
      if(response.status!=200){
        navigate('./..');
      }
        setListOfOrders(response.data);
        const requestCount = response.data.filter(order => order.status === 'Request').length;
        setReqCount(requestCount);
        console.log("REQ COUNT ", requestCount);
    }).catch((error) => {
        console.error("Error fetching orders: ", error);
        navigate('./..');
    });
}, []);

  return (
    <>
    <ToastContainer />
      <Navbar />
      <Button variant="outlined"
          onClick={toBack}  sx={{ position:'fixed', mt:'20px', ml:'35px', p:'10px'}}>
          Log out
        </Button>
      <Box component="div"
        sx={{
          display: 'grid',
          justifyContent: 'center'
        }}>
        
        <Button  variant="contained" sx={{mt:'25px'}}
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
