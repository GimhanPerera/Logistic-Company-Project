import { Box, Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const AddCourierToOrder = () => {
    const location = useLocation();
    const { orderId, courierId,courier_tracking_number,issue_date } = location.state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [listOfCourier, setListOfCourier] = useState(null);

    const [selectCourier, setSelectCourier] = useState(null);
    const [courierTN, setCourierTN] = useState(courier_tracking_number);
    const [issueDate, setIssueDate] = useState(issue_date);
    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleChange = (event) => {
        setSelectCourier(event.target.value);
    };
    const handleChangeTN = (event) => {
        setCourierTN(event.target.value);
    };
    const handleChangeDate = (event) => {
        setIssueDate(event.target.value);
    };

    const getDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate() ).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
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
            selectCourier: selectCourier,
            courier_tracking_number: checked? courierTN : '',
            issue_date: checked? issueDate : '',
        })
            .then((response) => {
                navigate('./..', { state: { id: orderId } });
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
            });
    }

    useEffect(() => {
        if(issueDate==null)
            setIssueDate(getDate());
        else
            setChecked(true)
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
                    <TextField label="Courier Tracking Number" size="small" type='text' name='Courier Tracking Number' margin="normal"
                        value={courierTN}
                        onChange={handleChangeTN}
                        disabled={!checked}
                    />
                    <TextField label="Issue date" size="small" type='date' name='issueDate' margin="normal"
                        value={issueDate}
                        onChange={handleChangeDate}
                        defaultValue={issueDate}
                        disabled={!checked}
                    />
                </Box>
                <Box component="div" sx={{ position: 'absolute', right: '8rem', bottom: '8.5rem', display: 'flex', flexDirection: 'column' }}>
                            
                            <FormControlLabel control={<Checkbox checked={checked} onChange={handleCheckboxChange} />} label="Issue the packages" />
                        </Box>

            </div>
        </>
    )
}

export default AddCourierToOrder;
