import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";
import { Field, Form, Formik, useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Countries } from '../countryCodes';
import Autheader from "../services/Autheader";
import { priceQuotationByCustomerValidation } from '../validations';
import Navbar from './navbar';

const initialValues = {
    items: '',
    packages: '',
    weight: '',
    shippingmethod: 'Air cargo',
    quotation: '',
    description: '',
    supplierLoc: 'China',
};

export const NewOrderRequest = () => {
    //const token = localStorage.getItem('token');
    const [image, setImage] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState(Countries.find((country) => country.label === 'China'));
    const toOrders = () => {
        navigate('../');
    }
    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Update the image file in the form data
    };
    const handleInvoiceChange = (e) => {
        setInvoice(e.target.files[0]); // Update the image file in the form data

    };

    const onSubmit = async (values, actions) => {
        console.log("LOG: ", selectedCountry);
        //return;
        if (image == null) {
            toast.error("Image is required");
            return
        } else if (invoice == null) {
            toast.error("Invoice is required");
            return
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post("http://localhost:3001/api/order", {
                "items": values.items,
                "packages": values.packages,
                "weight": values.weight,
                "shippingmethod": values.shippingmethod,
                "quotation": 0,
                "description": values.description,
                "supplierLoc": selectedCountry.label,
                "status": "Request",
                "image": image,
                "invoice": invoice,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...Autheader()
                }
            });
            navigate('../');
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error("Request failed");
        }
    }

    const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
        initialValues: initialValues,
        validationSchema: priceQuotationByCustomerValidation,
        onSubmit,
    });


    return (
        <>
            <Navbar />
            <ToastContainer />
            <div className="relative">
                <Formik>
                    <Form onSubmit={handleSubmit}>
                        <Box component="div"
                            sx={{ display: 'flex', justifyContent: 'space-around', mt: '1rem' }}>
                            <Box component="div" sx={{ border: '1px solid gray', p: '1rem', mb: '1rem' }}>
                                <Box component="h3" sx={{ mb: 2 }}>Enter your package details</Box>
                                <table style={{}}>
                                    <tr>
                                        <td>
                                            <TextField label="Items" size="small" type='text' name='items' margin="normal"
                                                value={values.items}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.items && Boolean(errors.items)}
                                                helperText={touched.items && errors.items}
                                            />
                                        </td>
                                        <td>
                                            <TextField label="No of packages" size="small" type='number' name='packages' margin="normal"
                                                value={values.packages}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.packages && Boolean(errors.packages)}
                                                helperText={touched.packages && errors.packages}
                                            /></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextField label="Rough weight(Kg)" size="small" type='number' name='weight' margin="normal"
                                                value={values.weight}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.weight && Boolean(errors.weight)}
                                                helperText={touched.weight && errors.weight}
                                            /></td>
                                        <td>
                                            <FormControl sx={{ m: 1, minWidth: 170 }}>
                                                <InputLabel id="demo-simple-select-helper-label">Shipping method</InputLabel>
                                                <Field
                                                    as={Select}
                                                    name="shippingmethod"
                                                    value={values.shippingmethod}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    label="Shipping method"
                                                    size='small'
                                                >
                                                    <MenuItem value={"Air cargo"}>Air Cargo</MenuItem>
                                                    <MenuItem value={"Ship cargo"}>Ship Cargo</MenuItem>
                                                </Field>
                                            </FormControl>
                                        </td>

                                    </tr>
                                    <tr>
                                        <Box component='td' sx={{
                                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                                        }}><TextField label="Description" size="small" type='text' name='description' margin="normal"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.description && Boolean(errors.description)}
                                            helperText={touched.description && errors.description}
                                            multiline
                                            maxRows={4}
                                            />
                                        </Box>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Autocomplete
                                                id="country-select-demo"
                                                sx={{ width: 250, mt: 2, mb: 2 }}
                                                options={Countries}
                                                autoHighlight
                                                defaultValue={selectedCountry}
                                                getOptionLabel={(option) => option.label}
                                                renderOption={(props, option) => (
                                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                        <img
                                                            loading="lazy"
                                                            width="20"
                                                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                            alt=""
                                                        />
                                                        {option.label} ({option.code})
                                                    </Box>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Choose a country"
                                                        size="small"
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            autoComplete: 'new-password', // disable autocomplete and autofill
                                                        }}
                                                    />
                                                )}
                                                onChange={(event, newValue) => {
                                                    setSelectedCountry(newValue);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label for="invoice">Image :</label></td>
                                        <td>
                                            <Field type="file" id="image" name="image" onChange={handleImageChange} accept="image/*"
                                                style={{
                                                    border: '1px solid #ccc',
                                                    padding: '10px',
                                                    borderRadius: '5px',
                                                    marginTop: '10px',
                                                    width: '200px',
                                                }} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label for="invoice">Performa invoice :</label></td>
                                        <td><input type="file" id="invoice" name="invoice" onChange={handleInvoiceChange}
                                            style={{
                                                border: '1px solid #ccc',
                                                padding: '10px',
                                                borderRadius: '5px',
                                                marginTop: '10px',
                                                width: '200px',
                                            }} />
                                        </td>
                                    </tr>
                                </table>
                                <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Button variant="contained"
                                        type="submit"
                                        sx={{ backgroundColor: '#68DD62', m: '1rem 0' }}>
                                        Request price quotation
                                    </Button>
                                    <Button onClick={toOrders} variant="outlined"
                                        sx={{}}>
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Form>
                </Formik>
            </div>

        </>
    )

}
