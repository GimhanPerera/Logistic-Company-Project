import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import axios from "axios";
import { Field, Form, Formik, useFormik } from 'formik';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { shipmentDetailsValidation } from '../../../validations';


const AddEditShipment = () => {
    const location = useLocation();
    const { shipment, shippingMethod, isNew } = location.state || {};
    const orderIds = shipment.Orders.map(order => order.order_id);
    //const orderIds = isNew? (shipment.Orders.map(order => order.order_id)):("");

    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    const getArrivalDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate() + 1).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const initialValues = {
        BLnumber: isNew ? ('') : (shipment.BL_no),
        shippingMethod: shippingMethod,
        displayDate: isNew ? (getArrivalDate()) : (shipment.displayed_arrival_date),
        loadedDate: isNew ? (getCurrentDate()) : (shipment.loaded_date),
        arrivalDate: isNew ? (getArrivalDate()) : (shipment.arrival_date),
    }

    const navigate = useNavigate();

    const toBack = () => {
        //console.log(shipment.Orders);
        navigate('../');
    }

    //--------------------------------
    const [checked, setChecked] = useState(orderIds);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        console.log(newChecked);

    };
    //--------------------------------

    if (isNew) {
        const onSubmit = async (values, actions) => {
            console.log("ADDED");
            const data = {
                BLnumber: values.BLnumber,
                shippingMethod: values.shippingMethod,
                displayDate: values.displayDate,
                loadedDate: values.loadedDate,
                arrivalDate: values.arrivalDate,
                orderIds:orderIds
            };
            const jsonString = JSON.stringify(data);
            axios.post('http://localhost:3001/api/shipment',jsonString, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                //MASSAGES NEED TO TRIGER
                navigate('../');
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
            });
        }
        const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
            initialValues: initialValues,
            validationSchema: shipmentDetailsValidation,

            onSubmit,
        });

        return (
            <>
                <Box component="h2" sx={{ margin: '1rem auto', width: '300px' }}>Create a Shipment</Box>
                <Box component="div" sx={{ display: 'flex', flexDirection: 'row', width: '900px', m: 'auto' }}>
                    <Box component="div" sx={{ border: '1px solid gray', p: '1rem', m: '1rem 1rem', width: '500px' }}>
                        <div>
                            <Formik>
                                <Form onSubmit={handleSubmit}>
                                    <table>
                                        <tr>
                                            <td>
                                                <TextField label="BL number" size="small" type='text' name='BLnumber' margin="normal"
                                                    value={values.BLnumber}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.BLnumber && Boolean(errors.BLnumber)}
                                                    helperText={touched.BLnumber && errors.BLnumber}
                                                    sx={{ mr: '1rem' }}
                                                />
                                            </td>
                                            <td>
                                                <FormControl sx={{ marginTop: '0.5rem', minWidth: 170 }}>
                                                    <InputLabel id="demo-simple-select-helper-label">Shipping method</InputLabel>
                                                    <Field
                                                        as={Select}
                                                        name="shippingMethod"
                                                        value={values.shippingMethod || initialValues.shippingMethod}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        label="Shipping method"
                                                        size='small'
                                                    >
                                                        <MenuItem value={'Air cargo'}>Air Cargo</MenuItem>
                                                        <MenuItem value={'Ship cargo'}>Ship Cargo</MenuItem>
                                                    </Field>
                                                </FormControl>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <TextField label="Loaded date" size="small" type='date' name='loadedDate' margin="normal"
                                                    value={values.loadedDate}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.loadedDate && Boolean(errors.loadedDate)}
                                                    helperText={touched.loadedDate && errors.loadedDate}
                                                    defaultValue={getCurrentDate()}
                                                />
                                            </td>
                                            <td>
                                                <TextField label="Arrival date" size="small" type='date' name='arrivalDate' margin="normal"
                                                    value={values.arrivalDate}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.arrivalDate && Boolean(errors.arrivalDate)}
                                                    helperText={touched.arrivalDate && errors.arrivalDate}
                                                    defaultValue={getArrivalDate()}
                                                />
                                            </td>
                                        </tr><tr>
                                            <td>
                                                <TextField label="Displayed arrival date" size="small" type='date' name='displayDate' margin="normal"
                                                    value={values.displayDate}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.displayDate && Boolean(errors.displayDate)}
                                                    helperText={touched.displayDate && errors.displayDate}
                                                    defaultValue={getArrivalDate()}
                                                />
                                            </td>
                                            <td></td>
                                        </tr>
                                    </table>
                                    <Box component="div" sx={{}}>
                                        <Button variant="outlined" sx={{ m: 1, width: '6rem' }} onClick={toBack}>Back</Button>
                                        <Button variant="contained" type='submit' sx={{ m: 1, width: '6rem' }}>Save</Button>
                                    </Box>
                                </Form>
                            </Formik>
                        </div>
                        <Box component="div" >

                            <Box
                                component="div"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end',
                                    height: '100%'
                                }}
                            >
                            </Box>
                        </Box>

                    </Box>
                    <Box component="div" sx={{ m: '1rem 2rem', border: '1px solid gray', p: 2, width: '300px' }}>
                        <div>Orders in Warehouse:</div>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {orderIds.map((value, index) => {
                                const labelId = `checkbox-list-label-${value}`;

                                return (
                                    <ListItem
                                        key={index}
                                        disablePadding
                                    >
                                        <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={checked.indexOf(value) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={labelId} primary={value} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                    <Box
                        component="div"
                        sx={{
                            color: '#3B82F6',
                            textDecoration: 'underline',
                        }}
                    >

                    </Box>
                </Box>
            </>
        );

    }
    else {
        const onSubmit = async (values, actions) => {
            console.log("UPDATED")
        }
        const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
            initialValues: initialValues,
            validationSchema: shipmentDetailsValidation,

            onSubmit,
        });

        return (
            <>
            <Box component="h2" sx={{ margin: '1rem auto', width: '200px' }}>Edit Shipment</Box>
            <Box component="div" sx={{ display: 'flex', flexDirection: 'row', width: '900px', m: 'auto' }}>
                <Box component="div" sx={{ border: '1px solid gray', p: '1rem', m: '1rem 1rem', width: '500px' }}>
                    <div>
                        <Formik>
                            <Form onSubmit={handleSubmit}>
                                <table>
                                    <tr>
                                        <td>
                                            <TextField label="BL number" size="small" type='text' name='BLnumber' margin="normal"
                                                value={values.BLnumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.BLnumber && Boolean(errors.BLnumber)}
                                                helperText={touched.BLnumber && errors.BLnumber}
                                                initialValues={values.BLnumber}
                                                sx={{ mr: '1rem' }}
                                            />
                                        </td>
                                        <td>
                                            <FormControl sx={{ marginTop: '0.5rem', minWidth: 170 }}>
                                                <InputLabel id="demo-simple-select-helper-label">Shipping method</InputLabel>
                                                <Field
                                                    as={Select}
                                                    name="shippingMethod"
                                                    value={values.shippingMethod || initialValues.shippingMethod}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    label="Shipping method"
                                                    size='small'
                                                >
                                                    <MenuItem value={'Air cargo'}>Air Cargo</MenuItem>
                                                    <MenuItem value={'Ship cargo'}>Ship Cargo</MenuItem>
                                                </Field>
                                            </FormControl>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextField label="Loaded date" size="small" type='date' name='loadedDate' margin="normal"
                                                value={values.loadedDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.loadedDate && Boolean(errors.loadedDate)}
                                                helperText={touched.loadedDate && errors.loadedDate}
                                                initialValues={values.loadedDate}
                                            />
                                        </td>
                                        <td>
                                            <TextField label="Arrival date" size="small" type='date' name='arrivalDate' margin="normal"
                                                value={values.arrivalDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.arrivalDate && Boolean(errors.arrivalDate)}
                                                helperText={touched.arrivalDate && errors.arrivalDate}
                                                initialValues={values.arrivalDate}
                                            />
                                        </td>
                                    </tr><tr>
                                        <td>
                                            <TextField label="Displayed arrival date" size="small" type='date' name='displayDate' margin="normal"
                                                value={values.displayDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.displayDate && Boolean(errors.displayDate)}
                                                helperText={touched.displayDate && errors.displayDate}
                                                initialValues={values.displayDate}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                </table>
                                <Box component="div" sx={{}}>
                                        <Button variant="outlined" sx={{ m: 1, width: '6rem' }} onClick={toBack}>Back</Button>
                                        <Button variant="contained" type='submit' sx={{ m: 1, width: '6rem' }}>Save</Button>
                                    </Box>
                            </Form>
                        </Formik>
                    </div>
                    <Box component="div" >

                        <Box
                            component="div"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                height: '100%'
                            }}
                        >


                        </Box>
                    </Box>

                </Box>
                <Box component="div" sx={{ m: '1rem 2rem', border: '1px solid gray', p: 2, width: '300px' }}>
                    <div>Orders assigned to this Shipment,</div>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {orderIds.map((value, index) => {
                            const labelId = `checkbox-list-label-${value}`;

                            return (
                                <ListItem
                                    key={index}
                                    disablePadding
                                >
                                    <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.indexOf(value) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={value} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
                <Box
                    component="div"
                    sx={{
                        color: '#3B82F6',
                        textDecoration: 'underline',
                    }}
                >
                </Box>
            </Box>
            </>
        );
    }
};

export default AddEditShipment;
