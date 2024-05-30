import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from "../../../components/SearchBar";
import ShipmentDetailsCard from "./ShipmentDetailsCard";

export const ShipmentDetails = () => {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    let filters = ["waiting", "completed"];

    const [listOfShipment, setListOfShipment] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [orderIds, setOrderIds] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/api/shipment")
            .then((response) => {
                setListOfShipment(response.data);
                setFilteredItems(response.data);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
                setLoading(false); // Set loading to false in case of error
            });
    }, []);

    useEffect(() => {
        filterItems();
    }, [selectedFilters]);
    const filterItems = () => {
        if (selectedFilters.length > 0) {
            let tempItems = selectedFilters.map((selectedCategory) => {
                let temp = listOfShipment.filter((item) => item.status === selectedCategory);
                return temp;
            });
            setFilteredItems(tempItems.flat());
        } else {
            setFilteredItems([...listOfShipment]);
        }
    }

    const handleFilterButtonClick = (selectedCategory) => {
        if (selectedFilters.includes(selectedCategory)) {
            let filters = selectedFilters.filter((el) => el !== selectedCategory);
            setSelectedFilters(filters);
        } else {
            setSelectedFilters([...selectedFilters, selectedCategory]);
        }
    };

    const navigate = useNavigate();
    const addShipment = async () => {
        //Get ready to ship order ids
        await axios.get("http://localhost:3001/api/order/readyToShipOrderIDs")
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

    return (
        <div>
            <SearchBar />
            <Button variant="contained"
                sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }} onClick={addShipment}>
                Add Shipment
            </Button>
            <Box component="div" sx={{ border: '1px solid black', margin: '0.7rem auto', padding: '0.3rem', display: 'flex', flexDirection: 'row', width: '800px' }}>
                <Box component='h3' sx={{ marginRight: '1rem' }}>Filter by status:</Box>
                <Box component="div" sx={{}}>
                    {filters.map((category, idx) => (
                        <Button size='small'
                            onClick={() => handleFilterButtonClick(category)}
                            style={selectedFilters?.includes(category) ? { backgroundColor: '#3a67fb', color: '#FFFFFF', height: '1.4rem', marginLeft: '0.3rem' } : { height: '1.4rem', marginLeft: '0.3rem' }}
                            key={`filters-${idx}`}
                        >
                            {category}
                        </Button>
                    ))}
                </Box>
            </Box>
            {/* Show loading indicator if data is being fetched */}
            {/* NEED TO ADD LOADING PAGE*/}
            {loading ? (
                <p>Loading...</p>
            ) : (
                filteredItems.map((shipment, index) => (
                    <Box component="div" key={`items-${index}`}
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

