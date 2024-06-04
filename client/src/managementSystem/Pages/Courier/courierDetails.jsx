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
    const [courierDetails, setCourierDetails] = useState(null); //Coutier details
    const [search, setSearch] = useState('');
    const [reload, setReload] = useState(true);
    //const [count, setCount] = useState(0);
    //const [reloading, setReloading] = useState(false);

    const removeCourierFromList = (courierID) => {
        setListOfCourier(prevList => prevList.filter(courier => courier.courier_id !== courierID));
    };
    const handleAddCourierClick = () => {
        setModalIsOpen('add'); // Or setModalIsOpen(true) depending on how you handle the modal state
    };
    const handleEditCourierClick = (cuID) => {
        setModalIsOpen(cuID); // Or setModalIsOpen(true) depending on how you handle the modal state
    };
    const updateCourierList = (updatedCourier) => {
        setListOfCourier(prevList => prevList.map(courier =>
            courier.courier_id === updatedCourier.courier_id ? updatedCourier : courier
        ));
        console.log("TIG")
        setReload(!reload);
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

    const reloadCouriers = () => {
        axios.get("http://localhost:3001/api/courier")
            .then((response) => {
                setListOfCourier(response.data);
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
            });
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

    return (
        <div className="relative">
            <SearchBar label='Search by courier id' search={search} setSearch={setSearch} />
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
                listOfCourier.filter((item) => {
                    return search == ''
                        ? item
                        : item.courier_id.includes(search);
                }).map((courier, index) => (
                    <Box component="div" key={index}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <CourierDetailsCard courier={courier} reload={reload} clickEdit={handleEditCourierClick} setCourierDetails={setCourierDetails} removeCourierFromList={removeCourierFromList} />
                    </Box>

                ))

            )}
            <AddEditCourierModal open={isModalOpen} onClose={() => setModalIsOpen('false')} courierDetails={courierDetails} reloadCouriers={reloadCouriers} />
        </div>
    );
};

export default CourierDetails;
