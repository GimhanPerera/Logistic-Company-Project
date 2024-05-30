import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "./navbar";

export const OrderTrackingDetails = () => {
    const navigate = useNavigate();
    // Extract the parameter from the URL
    const { trackingNumber } = useParams();

    const [trackingDetails, setTrackingDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const toLogin = () => {
        navigate('../');
    }
    useEffect(() => {
        axios.post("http://localhost:3001/api/order/trackorder", {
            "tracking_id": trackingNumber
        })
            .then((response) => {
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
                            <p>Order Open Date: {firstTrackingDetails.order_open_date}</p>
                            {firstTrackingDetails.Shipment ? (
                                <p>Arrival Date: {firstTrackingDetails.Shipment.displayed_arrival_date}</p>
                            ) : (<p>Arrival Date: -</p>)}

                            <p>No of packages: {firstTrackingDetails.Price_quotation.no_of_packages}</p>
                            <p>supplier location: {firstTrackingDetails.supplier_loc}</p>
                            {firstTrackingDetails.Shipment ? (
                                <p>Price quotation: {firstTrackingDetails.Price_quotation.quotation}</p>
                            ) : (<p>Price quotation: -</p>)}
                            {firstTrackingDetails.Shipment ? (
                                <p>Shipping method: {firstTrackingDetails.Price_quotation.shipping_method}</p>
                            ) : (<p>Shipping method: -</p>)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
