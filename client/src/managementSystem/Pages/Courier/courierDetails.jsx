import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import CourierDetailsCard from "./CourierDetailsCard";

const CourierDetails = () => {
    const [listOfCourier, setListOfCourier] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    
    useEffect(() => {
        axios.get("http://localhost:3001/courier")
            .then((response) => {
                setListOfCourier(response.data);
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
                listOfCourier.map((courier, index) => (
                    <div key={index} className="post flex flex-col items-center">
                        <CourierDetailsCard courier={courier} />
                    </div>
                ))
            )}
        </div>
    );
};

export default CourierDetails;
