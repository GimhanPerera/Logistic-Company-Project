import PrintIcon from '@mui/icons-material/Print';
import { Box, Button } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import ReactToPrint from 'react-to-print';
import PrintShippingMarks from './printShippingMarks';

const DisplayShippingMark = () => {
    const location = useLocation();
    const { orderId = '', printables, category } = location.state || {};
    //const { id } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null); // Set initial state to null
    const [loading, setLoading] = useState(false); // Loading state
    const componentRef = useRef();

    const toBack = () => {
        navigate('./..', { state: { id: orderId } });
    }

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while fetching data
    }

    if (!category) {
        return <div>No order details available</div>; // Handle case where no order details are available
    }
    return (
        <>
            <Box component='h1' sx={{ textAlign: 'center' }}>Shipping marks</Box>
            <Box component='div' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', pr:'110px', m:'1rem 0'}}>
                {/* Back btn */}
                <Button variant="outlined"
                    sx={{ ml: '20px' }}
                    onClick={toBack}
                >
                    Back
                </Button>

                {/*Print btn*/}
                <ReactToPrint
                    trigger={() => (
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<PrintIcon />}
                            sx={{ ml: '20px' }}
                        >
                            Print / Download
                        </Button>
                    )}
                    content={() => componentRef.current}
                    fileName="shipping_marks.pdf" // Set the default save name here
                />
            </Box>
            <Box component="div" sx={{ m: '10px 100px 50px 100px' }}>
                <Box component="div" ref={componentRef} className='motech' sx={{ m: '10px 10px' }}> {/*backgroundColor: 'yellow',*/}

                    <PrintShippingMarks printables={printables} category={category}></PrintShippingMarks>

                </Box>
            </Box>

        </>
    )
}

export default DisplayShippingMark;
