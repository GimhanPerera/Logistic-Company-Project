import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import ShipmentDetailsCard from "./ShipmentDetailsCard";

export const ShipmentDetails = () => {
    const [listOfShipment, setListOfShipment] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    
    useEffect(() => {
        axios.get("http://localhost:3001/shipment")
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
            {/* Show loading indicator if data is being fetched */}
            {/* NEED TO ADD LOADING PAGE*/}
            {loading ? (
                <p>Loading...</p>
            ) : (
                listOfShipment.map((shipment, index) => (
                    <div key={index} className="post flex flex-col items-center">
                        <ShipmentDetailsCard shipment={shipment} />
                    </div>
                ))
            )}
        </div>
    );
};

