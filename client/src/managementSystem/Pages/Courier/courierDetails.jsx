import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import AddEditCourierModal from "../../../Modals/addEditCourierModal";
import SearchBar from "../../../components/SearchBar";
import CourierDetailsCard from "./CourierDetailsCard";

const CourierDetails = () => {
    const [listOfCourier, setListOfCourier] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [isModalOpen, setModalIsOpen] = useState('false'); //Status of Modal

    //const [count, setCount] = useState(0);
    //const [reloading, setReloading] = useState(false);
    const reload = () => {
        //Not working
        console.log("Not worked2")
    }
    const handleAddCourierClick = () => {
        setModalIsOpen('add'); // Or setModalIsOpen(true) depending on how you handle the modal state
    };
    const handleEditCourierClick = (cuID) => {
        setModalIsOpen(cuID); // Or setModalIsOpen(true) depending on how you handle the modal state
    };
    useEffect(() => {
        axios.get("http://localhost:3001/api/courier")
            .then((response) => {
                setListOfCourier(response.data);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
                setLoading(false); // Set loading to false in case of error
            });
    }, []);


    useEffect(() => {
        axios.get("http://localhost:3001/api/courier")
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
        <div className="relative">
            <SearchBar />
            <Button variant="contained"
                onClick={handleAddCourierClick}
                sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }}>
                Add courier
            </Button>
            {/* Show loading indicator if data is being fetched */}
            {/* NEED TO ADD LOADING PAGE*/}
            {loading ? (
                <p>Loading...</p>
            ) : (
                listOfCourier.map((courier, index) => (
                    <Box component="div" key={index} 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                      >
                        <CourierDetailsCard courier={courier} reload={reload} clickEdit={handleEditCourierClick} />
                    </Box>

                ))

            )}
            <AddEditCourierModal open={isModalOpen} onClose={() => setModalIsOpen('false')} courierID="sss" />
        </div>
    );
};

export default CourierDetails;
