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
                width: '55%',
                border: '1px solid',
                marginTop: '0.75rem',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
            <div style={{width: '500px',}}>
                <div style={{marginBottom: '2px'}}>Complain ID: {complain.complain_id}</div>
                <div style={{ wordWrap: 'break-word',marginBottom: '2px', overflowWrap: 'break-word', maxWidth: '100%' }}>Complain: {complain.complain}</div>
                <div style={{marginBottom: '2px'}}>Order ID: {complain.order_id}</div>
                {complain.status != 'pending' ? <div style={{marginBottom: '2px'}}>Status: {complain.status}</div> : <div style={{ color: 'red',marginBottom: '2px' }}>Status: {complain.status}</div>}
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
