import { Box, Button, TextField, Typography } from '@mui/material';
import axios from "axios";
import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImg from '../assets/staffLoginImg.jpg';
import Navbar from './navbar';


export const ResetPwd = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [send, setSend] = useState(false);
    const [validation, setValidation] = useState(false);
    const [newPwd, setNewPwd] = useState('');
    const [newPwdC, setNewPwdC] = useState('');
    const [newPwdError, setNewPwdError] = useState('');
    const [newPwdCError, setNewPwdCError] = useState('');

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleOTP = (e) => {
        setOtp(e.target.value)
    }
    const toBack = () => {
        navigate('../stafflogin');
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cflRegex = /^CFL.{3}$/;
        return emailRegex.test(email) || cflRegex.test(email);
    };
    const sendOTP = async () => {
        if (!validateEmail(email)) {
            toast.error('Invalid email or User ID.');
            return;
        }
        try {
            // Check Validations
            const response = await axios.post("http://localhost:3001/api/employee/opt/request", {
                "email": email,
            });
            if (response.data == "Sent") {
                setSend(true);
            }
            else {
                toast.error("OTP didn't sent. Please check again your Email or User ID");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    }

    const isValidOtp = (otp) => {
        const otpRegex = /^\d{6}$/;
        return otpRegex.test(otp);
    };
    const checkOTP = async () => {
        try {
            // Check Validations
            if (!isValidOtp(otp)) {
                toast.error("OTP must be a 6-digit integer.");
                return;
            }

            const response = await axios.post("http://localhost:3001/api/employee/opt/check", {
                "email": email,
                "otp": otp
            });
            if (response.data == true) {
                setValidation(true);
            }
            else {
                toast.error("OTP is wrong");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    }

    const validatePasswords = () => {
        let isValid = true;
        if (newPwd.length <= 6) {
            setNewPwdError('Password must be more than 6 characters.');
            isValid = false;
        } else {
            setNewPwdError('');
        }

        if (newPwd !== newPwdC) {
            setNewPwdCError('Passwords do not match.');
            isValid = false;
        } else {
            setNewPwdCError('');
        }

        return isValid;
    };
    const changePWD = async () => {
        // Check Validations
        //setNewPwdCError('');
        //setNewPwdError('');
        if (!validatePasswords()) {
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/api/employee/opt/changePWD", {
                "emailOrUserID": email,
                "newPwd": newPwd
            });
            if (response.data == true) {
                toast.success("Your password changed");
                if (email.startsWith("CFL"))
                    navigate('../checkmyorder');
                else
                    navigate('../stafflogin');
            }
            else {
                toast.error("Something wrong");
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
                        {validation
                            ?
                            <>
                                {/* Change Password */}
                                <Box component="div" sx={{
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
                                    <Box component="h2" sx={{ mb: 2, textAlign: 'center' }}>Change Password</Box>
                                    <table>
                                        <tr>
                                            <td>
                                                <TextField label="New Password" size="small" type='password' name='newPwd' margin="normal" fullWidth
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
                                                <TextField label="Confirm New Password" size="small" type='password' name='tp' fullWidth
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
                                        sx={{ backgroundColor: '#68DD62', mt: '1rem' }} fullWidth>
                                        Change password
                                    </Button>
                                </Box>
                            </>
                            :
                            <>
                                {/* send otp */}
                                {!send ?
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
                                        <Typography>Enter your username or email. We'll send a OTP to your mobile number.</Typography>
                                        <Box component="h1"
                                            sx={{
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                lineHeight: 1.25,
                                                letterSpacing: '-0.025em',
                                                mt: '-1rem'
                                            }} onClick={sendOTP}>
                                            Enter user user ID or email
                                        </Box>
                                        <form>
                                            <div>
                                                <Box component="input"
                                                    value={email}
                                                    onChange={handleEmail}
                                                    id="email"
                                                    placeholder="Email or User ID"
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
                                            </div>
                                            <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={sendOTP}>
                                                Send OTP
                                            </Button>
                                            <div>
                                                <Box component="h5" sx={{ textAlign: 'center', color: '#1E90FF', fontSize: '0.875rem', fontWeight: 'medium', cursor: 'pointer', m: '1rem 0' }} underline="always" onClick={toBack}>Back</Box>
                                            </div>

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
                                        <Box component="h1"
                                            sx={{
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                lineHeight: 1.25,
                                                letterSpacing: '-0.025em',
                                                mt: '1rem'
                                            }} onClick={sendOTP}>
                                            Enter OTP
                                        </Box>
                                        <form>
                                            <div>
                                                <Box component="input"
                                                    type="number"
                                                    value={otp}
                                                    onChange={handleOTP}
                                                    placeholder="OPT"
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
                                            </div>
                                            <Button fullWidth variant="contained" sx={{ mt: 2, mb: 1 }} onClick={checkOTP}>
                                                Enter
                                            </Button>

                                            <div>
                                                <Box component="h5" sx={{ textAlign: 'center', color: '#1E90FF', fontSize: '0.875rem', fontWeight: 'medium', cursor: 'pointer', m: '1rem 0' }} underline="always" onClick={toBack}>Back</Box>
                                            </div>
                                        </form>
                                    </Box>
                                }
                            </>
                        }
                    </Box>
                </Box>
            </Box>
            <ToastContainer />
        </div>
    )
}

