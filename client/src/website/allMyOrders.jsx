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

//Desplay all orders of the customer
export const AllMyOrders = () => {
  const navigate = useNavigate();
  const [reqCount, setReqCount] = useState(0);//Order request count
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdC, setNewPwdC] = useState('');
  const [showPwdBox, setShowPwdBox] = useState(false);//is password box display

  const [oldPwdError, setOldPwdError] = useState('');
  const [newPwdError, setNewPwdError] = useState('');
  const [newPwdCError, setNewPwdCError] = useState('');

  //Logout and navigate to login page
  const toBack = () => {
    localStorage.removeItem('user')
    navigate('../');
  }

  //order request button
  const orderRequest = () => {
    console.log("REQ COUNT:" + reqCount)
    if (reqCount < 2) {//check the count is less than 2. If yes, Able to send new request
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
    // Reset error messages
    setOldPwdError('');
    setNewPwdError('');
    setNewPwdCError('');
  }

  const changePWD = () => {
    // Reset error messages
    setOldPwdError('');
    setNewPwdError('');
    setNewPwdCError('');

    // Basic validations
    let valid = true;

    if (!oldPwd) {
      setOldPwdError('Old Password is required');
      valid = false;
    }

    if (!newPwd) {
      setNewPwdError('New Password is required');
      valid = false;
    } else if (newPwd.length < 6) {
      setNewPwdError('New Password must be at least 6 characters long');
      valid = false;
    }

    if (!newPwdC) {
      setNewPwdCError('Please confirm the new password');
      valid = false;
    } else if (newPwd !== newPwdC) {
      setNewPwdCError('Passwords do not match');
      valid = false;
    }

    if (!valid) {
      return;
    }
    // END-Basic validations

    axios.post("http://localhost:3001/api/customers/changePwd", {//CHANGE THE PASSWORD
      "oldPwd": oldPwd,
      "newPwd": newPwd,
      "newPwdC": newPwdC,
    }, {
      headers: {
        ...Autheader()
      }
    })
      .then((response) => {//Changed successfully
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

  //get order details
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
      {/* Logout button */}
      <Button variant="outlined"
        onClick={toBack} sx={{ position: 'fixed', mt: '20px', ml: '35px', p: '10px' }}>
        Log out
      </Button>
      <Button variant="outlined"
        onClick={togglePwdBox} sx={{ position: 'fixed', mt: '20px', right: '70px', p: '10px' }}>
        {showPwdBox ? 'Close password box' : 'Change Password'}
      </Button>
      <Box component="div"
        sx={{
          display: 'grid',
          justifyContent: 'center'
        }}>

{/* Order request button */}
        <Button variant="contained" sx={{ mt: '25px' }}
          onClick={orderRequest}>
          Order Request
        </Button>
        {/* 'key' is the index in the array */}
        {/* Order list */}
        {listOfOrders.map((orders, index) => (
          <Box component="div"
            key={index} sx={{ width: '100%' }}>
            <OrderCard orders={orders} />
          </Box>
        ))}
      </Box>
      {showPwdBox ?
        <>
          {/* Change Password box */}
          <Box component="div" style={{ border: '1px solid gray', padding: '1rem', width: '250px', position: 'fixed', right: '5rem', top: '10rem' }}>
            <Box component="h3" sx={{ mb: 2, textAlign: 'center' }}>Change Password</Box>
            <table>
              <tr>
                <td>
                  <TextField label="Old Password" size="small" type='password' name='oldPwd'
                    value={oldPwd}
                    onChange={(e) => {
                      setOldPwdError('');
                      setOldPwd(e.target.value);
                    }}
                    error={!!oldPwdError}
                    helperText={oldPwdError}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <TextField label="New Password" size="small" type='password' name='newPwd' margin="normal"
                    value={newPwd}
                    onChange={(e) => {
                      setNewPwdError('');
                      setNewPwd(e.target.value);
                    }}
                    error={!!newPwdError}
                    helperText={newPwdError}
                    sx={{ mb: 2 }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <TextField label="Confirm New Password" size="small" type='password' name='tp'
                    value={newPwdC}
                    onChange={(e) => {
                      setNewPwdCError('');
                      setNewPwdC(e.target.value);

                    }}
                    error={!!newPwdCError}
                    helperText={newPwdCError}
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
        : ''}
    </>
  )

}

//export default AllMyOrders;
