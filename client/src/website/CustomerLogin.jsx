import { Box, Button } from '@mui/material';
import axios from "axios";
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImg from '../assets/customerLoginImg.jpg';
import { customerLoginValidation } from '../validations';
import Navbar from './navbar';
export const CustomerLogin = () => {
  const [show, setShow] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingNumberError, setTrackingNumberError] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  const checkTrackingNumber = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/order/isvalidtrackingnum", {
        "tracking_id": trackingNumber
      });
      if (response.data.isValid) {
        navigate(`./${trackingNumber}`);
      } else {
        setTrackingNumberError("Wrong tracking number");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const loginAsCustomer = useFormik({
    
    initialValues: {
      customerID: '',
      password:''
    },
    validationSchema: customerLoginValidation,
    onSubmit: async (values, actions) => {
        try {
            const response = await axios.post("http://localhost:3001/api/login/customer", {
                "cus_id": values.customerID,
                "pwd": values.password
            });

            if (response.data.isValid) {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('./myorders');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    },
});

  return (
    <div>
      <Navbar />
      <Box component="section" sx={{ backgroundColor: '#e0f0f3', height:'88vh',marginTop:'0rem' }}>
        <Box component="div"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop:'5rem',
          }}>
            <Box component="div">
              <img src={loginImg} alt='login image'  style={{width:'26.4rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',}}/>
            </Box>
          <Box component="div"
            sx={{
              width: '30%',
              backgroundColor: '#fff',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderColor: '#374151',
              marginTop: 0,
              maxWidth: '100%',
              padding: 0
            }}>
            <div>
              <Button variant="text" onClick={() => {setTrackingNumberError("");setTrackingNumber("");setShow(true);}} sx={{ width: "50%", border: '1px solid', borderRadius: 0, borderBottom: show ? 'none' : '1px solid', borderRight: show ? 'none' : '1px solid' }}>By customer ID</Button>
              <Button variant="text" onClick={() => setShow(false)} sx={{ width: "50%", border: '1px solid', borderRadius: 0, borderBottom: show ? '1px solid' : 'none', borderLeft: show ? '1px solid' : 'none' }}>By tracking number</Button>
            </div>
            {/*Login by customer ID form*/}
            {
              show ? <Box component="div"
                sx={{
                  height: '24rem',
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: '2.5rem',
                  paddingBottom: '2.5rem',
                  paddingLeft: '3rem',
                  paddingRight: '3rem',
                  gap: '1.5rem'
                }}>
                <Box component="h1"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: '-0.025em'
                  }}>
                  Check My Orders
                </Box>
                <form className="form" onSubmit={loginAsCustomer.handleSubmit}>{/*loginAsCustomer*/}
                  <div>
                    <Box component="input"
                      type="text"
                      name="customerID"
                      id="customerId"
                      placeholder="Customer ID"
                      value={loginAsCustomer.values.customerID}
                      onChange={loginAsCustomer.handleChange}
                      onBlur={loginAsCustomer.handleBlur}
                      required
                      sx={{
                        border: '1px solid #D1D5DB',
                        color: '#1F2937',
                        fontSize: '0.875rem',
                        borderRadius: '0.375rem',
                        outline: 'none',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        display: 'block',
                        width: '100%',
                        padding: '0.625rem',
                        '&:focus': {
                          borderColor: '#2563EB',
                          boxShadow: '0 0 0 0.125rem rgba(66, 153, 225, 0.5)'
                        }
                      }}
                    />
                    {loginAsCustomer.errors.customerID && loginAsCustomer.touched.customerID && <small style={{color:'red'}}>{loginAsCustomer.errors.customerID}</small>}
                  </div>
                  <div>
                    <Box component="input"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Passcode"
                      value={loginAsCustomer.values.password}
                      onChange={loginAsCustomer.handleChange}
                      onBlur={loginAsCustomer.handleBlur}
                      sx={{
                        border: '1px solid #D1D5DB',
                        color: '#1F2937',
                        fontSize: '0.875rem',
                        borderRadius: '0.375rem',
                        outline: 'none',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        display: 'block',
                        width: '100%',
                        padding: '0.625rem',
                        mt: '1rem',
                        '&:focus': {
                          borderColor: '#2563EB',
                          boxShadow: '0 0 0 0.125rem rgba(66, 153, 225, 0.5)'
                        }
                      }}
                      required />
                  </div>
                  {loginAsCustomer.errors.password && loginAsCustomer.touched.password && <small style={{color:'red'}}>{loginAsCustomer.errors.password}</small>}
                  <div>
                    <Box component="p" sx={{ color: '#1E90FF', fontSize: '0.875rem', fontWeight: 'medium', cursor: 'pointer', mt:'0.5rem' }} underline="always">Forgot password?</Box>
                  </div>
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Check my orders</Button>
                </form>
              </Box> : null
            }

            {/*Login by tracking number form*/}
            {
              show ? null : <Box component="div"
                sx={{
                  height: '24rem',
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: '2.5rem',
                  paddingBottom: '2.5rem',
                  paddingLeft: '3rem',
                  paddingRight: '3rem',
                  gap: '1.5rem'
                }}>
                <Box component="h1"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: '-0.025em'
                  }}>
                  Check My Orders
                </Box>
                <form className="form" onSubmit={checkTrackingNumber}>
                  <div>
                    <Box component="input"
                      type="text"
                      name="trNumber"
                      id="trNumber"
                      placeholder="Tracking number"
                      value={trackingNumber}
                      onChange={(e) => {
                        setTrackingNumberError("");
                        setTrackingNumber(e.target.value)
                      }}
                      required
                      sx={{
                        border: '1px solid #D1D5DB',
                        color: '#1F2937',
                        fontSize: '0.875rem',
                        borderRadius: '0.375rem',
                        outline: 'none',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        display: 'block',
                        width: '100%',
                        padding: '0.625rem',
                        marginBottom: '0.5rem',
                        '&:focus': {
                          borderColor: '#2563EB',
                          boxShadow: '0 0 0 0.125rem rgba(66, 153, 225, 0.5)'
                        }
                      }}
                    />
                  <p style={{fontSize:'0.8rem', color:'red', marginBottom: '0.5rem',marginLeft:'1rem'}}>{trackingNumberError}</p>
                  </div>
                  <div className="flex-div">
                    <Box component="p" sx={{ color: '#1E90FF', fontSize: '0.875rem', fontWeight: 'medium', cursor: 'pointer' }} underline="always">Forgot tracking number?</Box>
                  </div>
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Check my order</Button>
                </form>
              </Box>
            }

          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </div>

  )
}
