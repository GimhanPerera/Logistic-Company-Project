import { Box, Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AddCourierToOrder = () => {
    const location = useLocation();
    const { orderId, courierId, courier_tracking_number, issue_date } = location.state || {};
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
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const toBack = () => {
        navigate('./..', { state: { id: orderId } });
    }
    const toClear = () => {

        navigate('./..', { state: { id: orderId } });
    }
    const clearCourier = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Your courier data will be cleared!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, clear it!"
        }).then((result) => {
            if (result.isConfirmed) {
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
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Courier details cleared.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });

    }
    const assignCourier = () => {
        if(checked && !courierTN){
            toast.error("Enter the tracking number")
            return
        }
        else if(checked && courierTN.length <= 5){
            toast.error("Enter a valid tracking number")
            return
        }
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post("http://localhost:3001/api/courier/assign", {
                    orderId: orderId,
                    selectCourier: selectCourier,
                    courier_tracking_number: checked ? courierTN : '',
                    issue_date: checked ? issueDate : '',
                })
                    .then((response) => {
                        navigate('./..', { state: { id: orderId } });
                    })
                    .catch((error) => {
                        console.error("Error fetching courier details:", error);
                    });
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Courier details updated.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });

    }

    useEffect(() => {
        if (issueDate == null)
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
                <Button variant='outlined' onClick={toBack} sx={{ ml: '2rem' }}>
                    Back
                </Button>

                <Box component="h1" sx={{ textAlign: 'center' }}>Order ID: {orderId}</Box>
                <Box component="h2" sx={{ textAlign: 'center' }}>Choose a Courier service:</Box>
                <Box component="div" sx={{ textAlign: 'center', border: '1px gray solid', width: '500px', p: '1rem', pb: '4rem', m: '2rem auto', position: 'relative' }}>
                    <Box sx={{ width: '200px', margin: '0 auto' }}>
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
                    <Box sx={{ width: '450px', margin: '1rem auto' }}>
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
                            sx={{ ml: '1rem' }}
                            inputProps={{ min: today }}
                        />
                        <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <FormControlLabel control={<Checkbox checked={checked} onChange={handleCheckboxChange} />} label="Issue the packages" />
                        </Box>
                    </Box>

                    <Box component='div' sx={{ position: 'absolute', right: '3rem' }}>
                        <Button variant="outlined" onClick={clearCourier}>
                            Clear
                        </Button>
                        <Button variant="contained" onClick={assignCourier} sx={{ ml: '1rem' }}>
                            Assign
                        </Button>
                    </Box>

                </Box>

            </div>
            <ToastContainer></ToastContainer>
        </>
    )
}

export default AddCourierToOrder;
