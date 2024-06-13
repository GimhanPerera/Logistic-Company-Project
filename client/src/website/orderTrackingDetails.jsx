import { Box, Button, Paper, Step, StepLabel, Stepper } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logisticImg1 from "../assets/logisticImg1.jpg";
import Navbar from "./navbar";

export const OrderTrackingDetails = () => {
    const navigate = useNavigate();
    // Extract the parameter from the URL
    const { trackingNumber } = useParams();

    const [trackingDetails, setTrackingDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const toLogin = () => {
        navigate('../');
    }
    useEffect(() => {
        axios.post("http://localhost:3001/api/order/trackorder", {
            "tracking_id": trackingNumber
        })
            .then((response) => {
                setTrackingDetails(response.data);
                const tracking = response.data[0].status;
                switch (tracking) {
                    case 'Request':
                        setStep(0);
                        break;
                    case 'Just opened':
                        setStep(1);
                        break;
                    case 'Waiting':
                        setStep(2);
                        break;
                    case 'In Warehouse':
                        setStep(3);
                        break;
                    case 'Ship/airfreight ':
                        setStep(4);
                        break;
                    case 'onhand':
                        setStep(5);
                        break;
                    case 'Ready':
                        setStep(6);
                        break;
                    case 'FINISH':
                        setStep(7);
                        break;
                }

                setLoading(false);

            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
                setLoading(false);
            });
    }, []);

    // Check if trackingDetails array is empty or null
    if (trackingDetails.length === 0) return <div>No data</div>;

    // Access the first element of the array
    const firstTrackingDetails = trackingDetails[0];

    return (
        <div>
            <Navbar />
            <Box
            sx={{
                backgroundImage: `url(${logisticImg1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            }}
            >
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div style={{marginTop:'60px'}}>
                        <Button variant="outlined" sx={{ margin: '3rem 2rem 2rem 2rem', backgroundColor:'white' }}
                            onClick={toLogin}>
                            back
                        </Button>
                        <Box component="div" style={{ width: '900px', margin: 'auto' }}>
                            <Paper elevation={3} style={{ padding: '40px 16px', display: 'inline-block' }}>
                                <Box component="div" sx={{ marginTop: '2px', width: '900px', margin: 'auto' }}>
                                    <Box component="h1" sx={{ textAlign: 'center', mb: '2rem' }}>Tracking details</Box>

                                    <>
                                        <Stepper orientation='horizontal' alternativeLabel activeStep={step}>
                                            <Step>
                                                <StepLabel>Order Confirmed</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel>Waiting for Packages</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel>Packages in warehouse</StepLabel>
                                            </Step>
                                            <Step> {/* completed={true} */}
                                                <StepLabel>In Transit to Sri Lanka</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel>In Sri Lanka Warehouse</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel>Your Packages are Ready</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel>Completed</StepLabel>
                                            </Step>
                                            {/* <Step>
            <StepLabel optional={<Typography variant='caption'>Optional</Typography>}>Step 5</StepLabel>
        </Step> */}
                                        </Stepper>
                                    </>
                                </Box>
                                <Box component='div' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '2rem' }}>
                                    <div>
                                        <table>
                                            <tr>
                                                <td><p>Order ID</p></td>
                                                <td><p>: {firstTrackingDetails.order_id}</p></td>
                                            </tr>
                                            {/* <tr>
                                    <td><p>status</p></td>
                                    <td><p>: {firstTrackingDetails.status}</p></td>
                                </tr> */}
                                            <tr>
                                                <td><p>Tracking Number</p></td>
                                                <td><p>: {firstTrackingDetails.main_tracking_number}</p></td>
                                            </tr>
                                            <tr>
                                                <td><p>Order open date</p></td>
                                                <td><p>: {firstTrackingDetails.order_open_date}</p></td>
                                            </tr>
                                            {firstTrackingDetails.Shipment ? (
                                                <tr>
                                                    <td><p>Arrival date to Sri Lanka</p></td>
                                                    <td><p>: {firstTrackingDetails.Shipment.displayed_arrival_date}</p></td>
                                                </tr>
                                            ) : (
                                                ''
                                            )}
                                            {firstTrackingDetails.Price_quotation.no_of_packages ? (
                                                <tr>
                                                    <td><p>No of packages</p></td>
                                                    <td><p>: {firstTrackingDetails.Price_quotation.no_of_packages}</p></td>
                                                </tr>
                                            ) : (
                                                ''
                                            )}
                                            <tr>
                                                <td><p>From</p></td>
                                                <td><p>: {firstTrackingDetails.supplier_loc}</p></td>
                                            </tr>
                                            {/* <tr>
                                                <td>Price quotation</td>
                                                <td>: LKR {firstTrackingDetails.Price_quotation.quotation}</td>
                                            </tr> */}
                                            <tr>
                                                <td><p>Shipping method</p></td>
                                                <td><p>: {firstTrackingDetails.Price_quotation.shipping_method}</p></td>
                                            </tr>
                                            <tr>
                                                <td><p></p></td>
                                                <td><p></p></td>
                                            </tr>
                                            {/* {firstTrackingDetails.Shipment ? (
                                <p>Shipping method: {firstTrackingDetails.Price_quotation.shipping_method}</p>
                            ) : ('')} */}
                                        </table>
                                    </div>
                                </Box>
                            </Paper>
                        </Box>

                    </div>
                )}
            </Box>
        </div>
    )
}
