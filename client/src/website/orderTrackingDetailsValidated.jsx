import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ComplainModel from '../Modals/complainModal';
import FeedbackModel from '../Modals/feedbackModel';

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
        axios.post("http://localhost:3001/order/trackorder", {
            "tracking_id": id
        })
        .then((response) => {
            console.log("This is the ID: "+id)
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
    if(trackingDetails.length === 0) return <div>No data</div>;

    // Access the first element of the array
    const firstTrackingDetails = trackingDetails[0];

    return (
        <div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <button onClick={toLogin}>back</button>
                        <div>
                            <h1>Tracking details</h1>
                            <p>status: {firstTrackingDetails.status}</p>
                            <p>Order ID: {firstTrackingDetails.order_id}</p>
                            <p>Main Tracking Number: {firstTrackingDetails.main_tracking_number}</p>
                            <p>order_open_date: {firstTrackingDetails.order_open_date}</p>
                            {firstTrackingDetails.Shipment ? (
                                <p>desplayed_arriveal_date: {firstTrackingDetails.Shipment.desplayed_arriveal_date}</p>
                                ) : (<p>desplayed_arriveal_date: -</p>)}
                            
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
                            <p>If you have any issue with our service, You can <a onClick={() => setComplainIsOpen(true)} className="text-[#1E90FF] underline cursor-pointer">open a complain</a></p>
                            <p>Give your <a onClick={() => setFeedackIsOpen(true)} className="text-[#1E90FF] underline cursor-pointer">feedback</a></p>
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
