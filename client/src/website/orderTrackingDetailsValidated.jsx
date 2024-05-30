import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ComplainModel from '../Modals/complainModal';
import FeedbackModel from '../Modals/feedbackModel';
import Navbar from "./navbar";

export const OrderTrackingDetailsValidated = () => {
    const navigate = useNavigate();
    // Extract the parameter from the URL
    //const { trackingNumber } = useParams();
    const [isComplainOpen, setComplainIsOpen] = useState(false);
    const [isFeedbackOpen, setFeedackIsOpen] = useState(false);

    const [trackingDetails, setTrackingDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const toLogin = () => {
        navigate('../');
    }
    useEffect(() => {
        axios.post("http://localhost:3001/api/order/trackorder", {
            "tracking_id": id
        })
            .then((response) => {
                console.log("This is the ID: " + id)
                setTrackingDetails(response.data);
                setLoading(false);
                console.log(response.data);
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
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <Button variant="outlined" sx={{ margin: '15px', position: 'absolute' }}
                            onClick={toLogin}>
                            back
                        </Button>
                        <Box component="div" sx={{ marginTop: '2px', width: '400px', margin: 'auto' }}>
                            <Box component="h1">Tracking details</Box>
                            <table>
                                <tr>
                                    <td><p>status : </p></td>
                                    <td><p>{firstTrackingDetails.status}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Order ID : </p></td>
                                    <td><p>{firstTrackingDetails.order_id}</p></td>
                                </tr>
                                <tr>
                                    <td><p>status :</p></td>
                                    <td><p>{firstTrackingDetails.status}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Tracking Number : </p></td>
                                    <td><p>{firstTrackingDetails.main_tracking_number}</p></td>
                                </tr>
                                <tr>
                                    <td><p>order_open_date :</p></td>
                                    <td><p>{firstTrackingDetails.order_open_date}</p></td>
                                </tr>
                                {firstTrackingDetails.Shipment ? (
                                    <tr>
                                        <td><p>Arrival date:</p></td>
                                        <td><p>{firstTrackingDetails.Shipment.displayed_arrival_date}</p></td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td><p>Arrival date:</p></td>
                                        <td><p> -</p></td>
                                    </tr>
                                )}
                                <tr>
                                    <td><p>No of packages:</p></td>
                                    <td><p>{firstTrackingDetails.Price_quotation.no_of_packages}</p></td>
                                </tr>
                                <tr>
                                    <td><p>supplier_loc: </p></td>
                                    <td><p>{firstTrackingDetails.supplier_loc}</p></td>
                                </tr>
                                <tr>
                                    <td><p></p></td>
                                    <td><p></p></td>
                                </tr>
                                <tr>
                                    <td><p></p></td>
                                    <td><p></p></td>
                                </tr>
                                <tr>
                                    <td><p></p></td>
                                    <td><p></p></td>
                                </tr>
                            
                            {firstTrackingDetails.Shipment ? (
                                <tr>
                                <td>Price quotation:</td>
                                <td>{firstTrackingDetails.Price_quotation.quotation}</td>
                                </tr>
                            ) : (<tr>
                                <td>Shipping method:</td>
                                <td> -</td>
                            </tr>)}
                            {/* {firstTrackingDetails.Shipment ? (
                                <p>Shipping method: {firstTrackingDetails.Price_quotation.shipping_method}</p>
                            ) : (<p>Shipping method: -</p>)} */}
                            </table>
                        </Box>
                        <div style={{ marginTop: '2px', width: '600px', margin: 'auto', marginTop: '10px' }}>
                            <p>If you have any issue with our service, You can <a style={{ color: 'blue', textDecoration: 'underline' }} onClick={() => setComplainIsOpen(true)} >open a complain</a></p>
                            <p>Give your <a style={{ color: 'blue', textDecoration: 'underline' }} onClick={() => setFeedackIsOpen(true)} >feedback</a></p>
                        </div>
                        <ComplainModel open={isComplainOpen} onClose={() => setComplainIsOpen(false)} ordId={firstTrackingDetails.order_id}>
                        </ComplainModel>
                        <FeedbackModel open={isFeedbackOpen} onClose={() => setFeedackIsOpen(false)} ordId={firstTrackingDetails.order_id}>
                        </FeedbackModel>
                    </div>

                )}

            </div>
        </div>
    )
}
