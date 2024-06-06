import { Box, Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Autheader from "../services/Autheader";

export default function SendSmsModal({ open, onClose,smsDetails, reloadSms  }) {
    const [sms, setSMS] = useState('');

    useEffect(()=>{
        //setNameField(courierDetails? courierDetails.name : '');
    },[])

    const handleClose = (e) => {
        if (e.target.id === 'container') {
            setSMS(''); // Clear the text box
            reloadSms();
            onClose();
        }
    }
    const clickCloseBtn = () => {
        setSMS(''); // Clear the text box
        onClose();
    }

    const sendSMS = () => {

        //VALIDATION SHOULD DONE HERE

        axios.post("http://localhost:3001/api/sms", {
            msg: sms,
            oid: smsDetails
        }, {
            headers: {
                ...Autheader()
            }
        }).then((response) => {
            setSMS('');
            onClose();
        }).catch((error) => {
            console.error('Error submitting complain:', error);
        });
    }



    if (open == true) return (
        <>
            {/*Add Card*/}
            <Box component="div"
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '2rem',
                    zIndex: 50
                }}
            >
                <Box component="h4"
                    sx={{
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                    }}>Send SMS</Box>
                <Box
                    component="hr"
                    sx={{
                        height: '0.25rem',
                        marginTop: '0.5rem',
                        marginBottom: '0.5rem',
                        backgroundColor: 'gray'
                    }}
                ></Box>
                <div>
                    <p>SMS: </p>
                    <Box component="input"
                        sx={{
                            border: '1px solid black',
                            width: '24rem',
                            padding: '0.25rem'
                        }}
                        value={sms}
                        onChange={(e) => setSMS(e.target.value)}
                    ></Box>
                    <div>
                        <Button onClick={sendSMS} fullWidth variant="contained" sx={{ mt: 3, mb: 1, border: '1px solid #1E90FF' }}>Send</Button><br />
                        <Button onClick={clickCloseBtn} fullWidth variant="contained" sx={{ mt: 0, mb: 2, border: '1px solid #1E90FF', color: '#1E90FF', backgroundColor: 'white' }}>Cancel</Button>
                    </div>
                </div>
            </Box>

            {/*Background*/}
            <Box component="div"
                id='container' onClick={handleClose}
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // black with 70% opacity
                    zIndex: 40
                }}
            />
        </>
    )
    else return null;

}
