import { Box, Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
export const StaffLogin = () => {
    return (
        <div>
            <Navbar />
            <Box component="section" sx={{ backgroundColor: '#edfeff' }}>
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
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
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
                        <Box component="div"
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
                                Login
                            </Box>
                            <form action="#">
                                <div>
                                    <Box component="input"
                                        type="text"
                                        name="Email"
                                        id="email"
                                        placeholder="Email"
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
                                            mb: '1rem',
                                            '&:focus': {
                                                borderColor: '#2563EB',
                                                boxShadow: '0 0 0 0.125rem rgba(66, 153, 225, 0.5)'
                                            }
                                        }}
                                        required />
                                </div>
                                <div>
                                    <Box component="input"
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Password"
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
                                            mb: '1rem',
                                            '&:focus': {
                                                borderColor: '#2563EB',
                                                boxShadow: '0 0 0 0.125rem rgba(66, 153, 225, 0.5)'
                                            }
                                        }}
                                        required />
                                </div>
                                <div>
                                    <Box component="p" sx={{ color: '#1E90FF', fontSize: '0.875rem', fontWeight: 'medium', cursor: 'pointer' }} underline="always">Forgot tracking number?</Box>
                                </div>
                                <Link to="../cmsystem">
                                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                        Log in
                                    </Button>
                                </Link>
                            </form>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </div>
    )
}

