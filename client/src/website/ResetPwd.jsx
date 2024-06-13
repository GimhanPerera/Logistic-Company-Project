import { Box, Button } from '@mui/material';
import axios from "axios";
import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImg from '../assets/staffLoginImg.jpg';
import Navbar from './navbar';


export const ResetPwd = () => {

    const location = useLocation();
    const { email } = location.state || {};
    const navigate = useNavigate();
    const [otp, setOtp] = useState(0);
    const [send, setSend] = useState(false);


    const sendOTP = async (values, actions) => {
        try {
            // Check the detials
            const response = await axios.post("http://localhost:3001/api/employee/opt/request", {
                "email": email,
            });
            if (response.data) {
                setSend(true);
            }
            else {
                toast.error("OTP didn't send");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }

    }

    return (
        <div>
            <Navbar />
            <Box component="section" sx={{ backgroundColor: '#edfeff', height: '87vh' }}>
                <Box component="div"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: '1.5rem',
                        paddingRight: '1.5rem',
                        paddingTop: '4rem',
                        paddingBottom: '2rem',
                    }}>
                    <Box component="div"
                        sx={{
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            borderColor: '#374151',
                            marginTop: 0,
                            maxWidth: '100%',
                            padding: 0,
                            display: 'flex',
                            flexDirectionL: 'row'
                        }}>
                        {/* Image */}
                        <Box component="div">
                            <img src={loginImg} alt='login image' style={{ width: '26.4rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', }} />
                        </Box>
                        {/* send otp */}
                        {sendOTP?
                        <Box component="div"
                            sx={{
                                height: '23rem',
                                display: 'flex',
                                flexDirection: 'column',
                                paddingTop: '2.5rem',
                                paddingBottom: '2.5rem',
                                paddingLeft: '3rem',
                                paddingRight: '3rem',
                                gap: '1.5rem',
                                width: '26.4rem'
                            }}>
                            <Box component="h1"
                                sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    lineHeight: 1.25,
                                    letterSpacing: '-0.025em',
                                    marginTop: '2rem'
                                }} onClick={sendOTP}>
                                Send OTP
                            </Box>
                            <form>
                                <div>
                                    <Box component="input"
                                        type="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        id="email"
                                        placeholder="Email"
                                        onBlur={handleBlur}
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
                                </div>
                                <div>
                                    <Box component="p" sx={{ color: '#1E90FF', fontSize: '0.875rem', fontWeight: 'medium', cursor: 'pointer', m: '1rem 0' }} underline="always">Forgot password?</Box>
                                </div>
                                <div>
                                </div>
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }} onClick={sendOTP}>
                                    Enter
                                </Button>

                            </form>
                        </Box>
                        :
                        <Box component="div"
                            sx={{
                                height: '23rem',
                                display: 'flex',
                                flexDirection: 'column',
                                paddingTop: '2.5rem',
                                paddingBottom: '2.5rem',
                                paddingLeft: '3rem',
                                paddingRight: '3rem',
                                gap: '1.5rem',
                                width: '26.4rem'
                            }}>
                            <form>
                                <div>
                                    <Box component="input"
                                        type="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        id="email"
                                        placeholder="Email"
                                        onBlur={handleBlur}
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
                                </div>
                                <div>
                                    <Box component="p" sx={{ color: '#1E90FF', fontSize: '0.875rem', fontWeight: 'medium', cursor: 'pointer', m: '1rem 0' }} underline="always">Forgot password?</Box>
                                </div>
                                <div>
                                </div>
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }} onClick={sendOTP}>
                                    Enter
                                </Button>

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

