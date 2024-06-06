import { Box, Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const AddCourierToOrder = () => {
    const location = useLocation();
    const { orderId, courierId } = location.state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [listOfCourier, setListOfCourier] = useState(null);

    const [selectCourier, setSelectCourier] = useState(null);
    const [courierTN, setCourierTN] = useState('');
    const [issueDate, setIssueDate] = useState('');

    const handleChange = (event) => {
        setSelectCourier(event.target.value);
    };


    const toBack = () => {
        navigate('./..', { state: { id: orderId } });
    }
    const toClear = () => {

        navigate('./..', { state: { id: orderId } });
    }
    const clearCourier = () => {
        axios.post("http://localhost:3001/api/courier/clear", {
            orderId: orderId,
            selectCourier: '0'
        })
            .then((response) => {
                navigate('./..', { state: { id: orderId } });
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
            });
    }
    const assignCourier = () => {
        axios.post("http://localhost:3001/api/courier/assign", {
            orderId: orderId,
            selectCourier: selectCourier
        })
            .then((response) => {
                navigate('./..', { state: { id: orderId } });
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
            });
    }

    useEffect(() => {
        axios.get("http://localhost:3001/api/courier")
            .then((response) => {
                setListOfCourier(response.data);
                setSelectCourier(courierId != null ? courierId : response.data[0].courier_id)
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
                setLoading(false); // Set loading to false in case of error
            });
    }, []);


    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while fetching data
    }

    return (
        <>
            <div>
                <Button onClick={toBack}>
                    Back
                </Button>
                <Button onClick={clearCourier}>
                    Clear
                </Button>
                <Button variant="contained" onClick={assignCourier}>
                    Assign
                </Button>

                <Box component="h1">Order ID: {orderId}</Box>
                <Box component="h2">Choose a Courier service:</Box>

                <Box sx={{ width: '200px' }}>
                    <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-label"
                            value={selectCourier}
                            onChange={handleChange}
                        >
                            {listOfCourier.map((courier, index) => (
                                <MenuItem value={courier.courier_id}>{courier.courier_id} - {courier.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <TextField label="Courier Tracking Number" size="small" type='number' name='Courier Tracking Number' margin="normal"
                        value={courierTN}
                        onChange={setCourierTN}
                    />
                    <TextField label="Issue date" size="small" type='date' name='issueDate' margin="normal"
                        value={issueDate}
                        onChange={setIssueDate}
                    />
                </Box>

            </div>
        </>
    )
}

export default AddCourierToOrder;
