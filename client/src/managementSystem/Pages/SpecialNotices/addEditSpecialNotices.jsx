import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AddEditSpecialNotices = () => {

    const location = useLocation();
    const { notice,isNew } = location.state || {};
    const [loading, setLoading] = useState(true); // State to track loading status
    const [orderIds, setOrderIds] = useState([]);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const toBack = () => {
        navigate('./..');
    }
useEffect(()=>{
    console.log("NOTICE ",notice);
    setLoading(false);
},[notice])
    const addShipment = async () => {
        //Get ready to ship order ids
        await axios.get("http://localhost:3001/api/noitces/")
            .then((response) => {
                setOrderIds(response.data);
                const shipment = {
                    BL_no: '',
                    shipping_method: '',
                    loaded_date: '',
                    arrival_date: '',
                    desplayed_arriveal_date: '',
                    Orders: response.data,
                }
                //console.log(orderIds)
                if (response.data == []) {
                    console.log("No orders available for shipments");
                    return;
                }
                //console.log(response.data);
                navigate('./details', { state: { shipment: shipment, shippingMethod: 'Air cargo', isNew: true } });
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
            });

    }
    if(loading) return null;
    else if (isNew)
        return (
            <>
                <Button onClick={toBack}>Back</Button>
                <div>
                    New
                </div>
            </>
        );
    else return (
        <>
            <Button onClick={toBack}>Back</Button>
            <div>
                Edit
            </div>
        </>
    )
};

