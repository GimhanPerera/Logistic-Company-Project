import { Box } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveIDContext } from './../managementSystem/Pages/Customer/ActiveIDContext';
import './complainModal.css';

export default function OrderIDsModal({ open, onClose}) {
    const navigate = useNavigate();
    const { activeIDlist } = useContext(ActiveIDContext);
    const token = localStorage.getItem('token');
    const handleClose = (e) => {
        if (e.target.id === 'container') {
            onClose();
        }
    }
    const toView = (orderID) => {
        navigate('../order/view', { state: { id: orderID } });
    };

    if (!open) return null;
    return (
        <>
            {/*Card*/}
            <div id='card'>
                <h4 id='title'>Order IDs</h4><hr />
                {activeIDlist != null && activeIDlist.map((orderID, index) => (
                    <Box component="div" sx={{fontSize:'1.4rem', cursor:'pointer'}} key={index} onClick={() => toView(orderID)}>
                        {orderID}
                    </Box>
                ))}
                {activeIDlist == '' ? <Box component="h5" sx={{textAlign:'center'}}>No orders</Box>:''}
            </div>


            {/*Background*/}
            <div
                id='container' onClick={handleClose}
            />
        </>
    )
}
