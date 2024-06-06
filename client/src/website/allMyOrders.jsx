import { Box, Button, TextField } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import Autheader from "../services/Autheader";
import Navbar from "./navbar";
import OrderCard from "./orderCard";

export const AllMyOrders = () => {
  const navigate = useNavigate();
  const [reqCount, setReqCount] = useState(0);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdC, setNewPwdC] = useState('');
  const [showPwdBox, setShowPwdBox] = useState(false);
  const toBack = () => {
    localStorage.removeItem('user')
    navigate('../');
  }
  const orderRequest = () => {
    console.log("REQ COUNT:" + reqCount)
    if (reqCount < 2) {
      navigate('./request');
      return
    }
    toast.error("Maximum of 2 orders requests can be send at once");

  }
  const [listOfOrders, setListOfOrders] = useState([]);
  const togglePwdBox = () => {
    setShowPwdBox(!showPwdBox);
    setOldPwd('');
    setNewPwd('');
    setNewPwdC('');
  }

  const changePWD = () => {
    axios.post("http://localhost:3001/api/customers/changePwd", {
      "oldPwd": oldPwd,
      "newPwd": newPwd,
      "newPwdC": newPwdC,
    }, {
      headers: {
        ...Autheader()
      }
    })
      .then((response) => {
        console.log("PWD CHANGED");
        setShowPwdBox(!showPwdBox);
        setOldPwd('');
        setNewPwd('');
        setNewPwdC('');
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Password Changed",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch((error) => {
        console.error("Wrong password:", error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Wrong password",
          showConfirmButton: false,
          timer: 1500
        });
      });
  }


  useEffect(() => {
    axios.get("http://localhost:3001/api/order/myTrackingDetails", {
      headers: Autheader()
    }).then((response) => {
      if (response.status != 200) {
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
        onClick={toBack} sx={{ position: 'fixed', mt: '20px', ml: '35px', p: '10px' }}>
        Log out
      </Button>
      <Button variant="outlined"
        onClick={togglePwdBox} sx={{ position: 'fixed', mt: '20px', right: '70px', p: '10px' }}>
        {showPwdBox? 'Close password box' : 'Change Password'}
      </Button>
      <Box component="div"
        sx={{
          display: 'grid',
          justifyContent: 'center'
        }}>

        <Button variant="contained" sx={{ mt: '25px' }}
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
      {showPwdBox? 
      <>
      {/* Change Password */}
      <Box component="div" style={{ border: '1px solid gray', padding: '1rem', width: '250px', position:'fixed', right:'5rem', top:'10rem' }}>
        <Box component="h3" sx={{ mb: 2, textAlign: 'center' }}>Change Password</Box>
        <table>
          <tr>
            <td>
              <TextField label="Old Password" size="small" type='password' name='oldPwd'
                value={oldPwd}
                onChange={(e) => setOldPwd(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <TextField label="New Password" size="small" type='password' name='newPwd' margin="normal"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                sx={{ mb: 2 }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <TextField label="Confirm New Password" size="small" type='password' name='tp'
                value={newPwdC}
                onChange={(e) => setNewPwdC(e.target.value)}
              />
            </td>
          </tr>
        </table>
        <Button variant="contained" onClick={changePWD}
          sx={{ backgroundColor: '#68DD62', ml: '40px', mt: '1rem' }}>
          Change password
        </Button>
      </Box>
      </>
      :''}
    </>
  )

}

//export default AllMyOrders;
