import { Box } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveIDContext } from './../managementSystem/Pages/Customer/ActiveIDContext';
import './complainModal.css';

//In courier services, History button clicked. This modal will popup
export default function OrderIDsModal({ open, onClose}) {
    const navigate = useNavigate();
    const { activeIDlist } = useContext(ActiveIDContext);//order list
    const token = localStorage.getItem('token');
    //close the modal
    const handleClose = (e) => {
        if (e.target.id === 'container') {
            onClose();
        }
    }

    //navigate to order details page
    const toView = (orderID) => {
        navigate('../order/view', { state: { id: orderID } });
    };

    if (!open) return null;//if modal closed
    return (
        <>
            {/*Modal*/}
            <div id='card'>
                {/* Title */}
                <h4 id='title'>Order IDs</h4><hr />
                {/* Order title list */}
                {activeIDlist != null && activeIDlist.map((orderID, index) => (
                    <Box component="div" sx={{fontSize:'1.4rem', cursor:'pointer'}} key={index} onClick={() => toView(orderID)}>
                        {orderID}
                    </Box>
                ))}

                {/* Check whether there are orders or not */}
                {activeIDlist == '' ? <Box component="h5" sx={{textAlign:'center'}}>No orders</Box>:''}
            </div>


            {/*Background*/}
            <div
                id='container' onClick={handleClose}
            />
        </>
    )
}
