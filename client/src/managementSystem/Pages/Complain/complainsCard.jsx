import { Box, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import axios from "axios";
import React from 'react';

const ComplainDetailsCard = ({ complain, setSmsDetails, onOpen, reloadDetails, setReloadDetails }) => {

    const toggleReviewStatus = () => {
        axios.post("http://localhost:3001/api/complain/reviewed", {
            "complain_id": complain.complain_id,
            "status": complain.status == 'pending'? 'reviewed' : 'pending'
        }).then((response) => {
            setReloadDetails(!reloadDetails);
        })
    };

    const sendSMS = () => {
        setSmsDetails(complain.order_id);
        onOpen();
    };


    return (
        <Paper
            sx={{
                width: '50%',
                height: '7rem',
                border: '1px solid',
                marginTop: '0.75rem',
                padding: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
            <div>
                <div className="">Complain ID: {complain.complain_id}</div>
                <div className="">Complain: {complain.complain}</div>
                <div className="">Order ID: {complain.order_id}</div>
                {complain.status != 'pending' ? <div>Status: {complain.status}</div> : <div style={{ color: 'red' }}>Status: {complain.status}</div>}
            </div>
            <div>
                <Box component="div"
                    sx={{
                        color: '#3b82f6',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        height: '100%',
                        textDecoration: 'underline'
                    }}
                >
                    <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }} onClick={toggleReviewStatus}>{complain.status == 'pending' ? 'Set as Reviewed' : 'Set as Pending'}</Button>
                    <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }} onClick={sendSMS}>Send SMS</Button>
                </Box>
            </div>
        </Paper>
    )
}

export default ComplainDetailsCard
