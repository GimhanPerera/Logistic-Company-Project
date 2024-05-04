import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import ShipmentDetailsCard from "./ShipmentDetailsCard";

export const ShipmentDetails = () => {
    const [listOfShipment, setListOfShipment] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status

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

    return (
        <div>
            <SearchBar />
            <Button variant="contained"
                sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }}>
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

