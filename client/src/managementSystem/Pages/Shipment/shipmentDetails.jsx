import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from "../../../components/SearchBar";
import ShipmentDetailsCard from "./ShipmentDetailsCard";

export const ShipmentDetails = () => {
    const [listOfShipment, setListOfShipment] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [orderIds, setOrderIds] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/api/shipment")
            .then((response) => {
                setListOfShipment(response.data);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
                setLoading(false); // Set loading to false in case of error
            });
    }, []);

const navigate = useNavigate();
    const addShipment = async () => {
        //Get ready to ship order ids
        await axios.get("http://localhost:3001/api/order/readyToShipOrderIDs")
            .then((response) => {
                setOrderIds(response.data);
                const shipment = {
                    BL_no:'',
                    shipping_method:'',
                    loaded_date:'',
                    arrival_date:'',
                    desplayed_arriveal_date:'',
                    Orders: response.data,
                }
                //console.log(orderIds)
                if(response.data==[]){
                    console.log("No orders available for shipments");
                    return;
                }
                //console.log(response.data);
                navigate('./details', { state: { shipment: shipment, shippingMethod: 'Air cargo', isNew:true }});
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
            });
            
      }

    return (
        <div>
            <SearchBar />
            <Button variant="contained"
                sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }} onClick={addShipment}>
                Add Shipment
            </Button>
            {/* Show loading indicator if data is being fetched */}
            {/* NEED TO ADD LOADING PAGE*/}
            {loading ? (
                <p>Loading...</p>
            ) : (
                listOfShipment.map((shipment, index) => (
                    <Box component="div" key={index}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <ShipmentDetailsCard shipment={shipment} />
                    </Box>
                ))
            )}
        </div>
    );
};

