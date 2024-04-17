import axios from "axios";
import React, { useEffect, useState } from 'react';
//import { useParams } from 'react-router-dom';

export const OrderTrackingDetails = () => {
    const [trackingDetails, setTrackingDetails] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    //const [trackingNumber] = useParams();
    useEffect(() => {
        axios.post("http://localhost:3001/order/trackorder",{
            "tracking_id": "4232432SDA4"
        })
            .then((response) => {
                setTrackingDetails(response.data);console.table(trackingDetails)
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
                setLoading(false); // Set loading to false in case of error
            });
    }, []);

    if(!trackingDetails) return <div>No data</div>

  return (
    <div>
      <div>
            {/* Show loading indicator if data is being fetched */}
            {/* NEED TO ADD LOADING PAGE*/}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h1>Tracking details</h1>
                    <p>Order ID:{trackingDetails.order_id}</p>
                    <p>{trackingDetails.main_tracking_number}</p>
                </div>
            )}
        </div>
    </div>
  )
}