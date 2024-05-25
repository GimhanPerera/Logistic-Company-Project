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
                        <Button variant="outlined"
                            onClick={toLogin}>
                            back
                        </Button>
                        <div>
                            <Box component="h1">Tracking details</Box>
                            <p>status: {firstTrackingDetails.status}</p>
                            <p>Order ID: {firstTrackingDetails.order_id}</p>
                            <p>Main Tracking Number: {firstTrackingDetails.main_tracking_number}</p>
                            <p>order_open_date: {firstTrackingDetails.order_open_date}</p>
                            {firstTrackingDetails.Shipment ? (
                                <p>displayed_arrival_date: {firstTrackingDetails.Shipment.displayed_arrival_date}</p>
                            ) : (<p>displayed_arrival_date: -</p>)}

                            <p>No of packages: {firstTrackingDetails.Price_quotation.no_of_packages}</p>
                            <p>supplier_loc: {firstTrackingDetails.supplier_loc}</p>
                            {firstTrackingDetails.Shipment ? (
                                <p>Price quatation: {firstTrackingDetails.Price_quotation.quotation}</p>
                            ) : (<p>Price quatation: -</p>)}
                            {firstTrackingDetails.Shipment ? (
                                <p>Shipping method: {firstTrackingDetails.Price_quotation.shipping_method}</p>
                            ) : (<p>Shipping method: -</p>)}
                        </div>
                        <div>
                            <p>If you have any issue with our service, You can <a onClick={() => setComplainIsOpen(true)} >open a complain</a></p>
                            <p>Give your <a onClick={() => setFeedackIsOpen(true)} >feedback</a></p>
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
