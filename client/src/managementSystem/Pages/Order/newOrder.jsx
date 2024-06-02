import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from "axios";
import { Field, Form, Formik, useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import AddCustomerModel from "../../../Modals/addCustomerModal";
import { Countries } from '../../../countryCodes';
import Autheader from "../../../services/Autheader";
import { priceQuotationValidation } from '../../../validations';

const initialValues = {
    items: '',
    packages: '',
    weight: '',
    shippingmethod: 'Air cargo',
    category: 'G',
    quotation: '',
    description: '',
    supplierLoc: 'China',
}


const NewOrder = () => {
    const [dropDownValue, setDropDownValue] = React.useState("Ship cargo");

    const dropDownChange = (event) => {
        setDropDownValue(event.target.value);

    };
    const [isAddCustomerOpen, setAddCustomerOpen] = useState(false);
    const [customerID, setCustomerID] = useState("");
    const [passcode, setPasscode] = useState('');
    const [customerName, setCustomerName] = useState("");
    const [customerTp, setCustomerTp] = useState("");
    const [image, setImage] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState(Countries.find((country) => country.label === 'China'));
    const [category, setCategory] = useState('G');
    const [chatLink, setChatLink] = useState('');
    const [checked, setChecked] = React.useState(false);

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    const toOrders = () => {
        navigate('../order');
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Update the image file in the form data
    };
    const handleInvoiceChange = (e) => {
        setInvoice(e.target.files[0]); // Update the image file in the form data

    };

    const searchCustomer = async (e) => {//search customer
        // Regular expression to match the pattern
        const regex = /^CFL\d{3}$/;
        if (customerID == "") {
            toast.error("Please enter the Customer ID");
            return
        } else if (!regex.test(customerID)) {
            toast.error("Wrong Customer ID format");
            return
        }
        axios.get(`http://localhost:3001/api/customers/search/${customerID}`, {
        }).then((response) => {
            setCustomerName(response.data.name)
            setCustomerTp(response.data.tel_number);

        }).catch((error) => {
            console.error('Error :', error);
            setCustomerName("");
            setCustomerTp("");
            toast.error("Wrong customer ID");
        });
    }

    const onSubmit = async (values, actions) => {
        //Customer validations
        const regex = /^CFL\d{3}$/;
        if (customerID == "") {
            toast.error("Please enter the Customer ID");
            return
        } else if (!regex.test(customerID)) {
            toast.error("Wrong Customer ID format");
            return
        } else if (image == null) {
            toast.error("Image is required");
            return
        } else if (invoice == null) {
            toast.error("Invoice is required");
            return
        }

        //========================
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#68DD62",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Create the order!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    //const token = localStorage.getItem('token');
                    await axios.post("http://localhost:3001/api/order", {
                        "items": values.items,
                        "packages": values.packages,
                        "weight": values.weight,
                        "shippingmethod": values.shippingmethod,
                        "quotation": values.quotation,
                        "description": values.description,
                        "supplierLoc": selectedCountry.label,
                        "status": "Just opened",
                        "image": image,
                        "invoice": invoice,
                        "cusID": customerID,
                        "passcode":passcode,
                        "name": customerName,
                        "tp": customerTp,
                        "category": values.category,
                        "chatLink": checked ? chatLink : ''
                    }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            ...Autheader()
                        }
                    });
                    Swal.fire({
                        title: `New order created`,
                        icon: "success"
                    });
                    navigate('../order');
                } catch (error) {
                    console.error('Error creating order:', error);
                }
            }
        });
    }

    const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
        initialValues: initialValues,
        validationSchema: priceQuotationValidation,

        onSubmit,
    });

    return (
        <>
            <ToastContainer />
            <div className="relative">
                <Formik>
                    <Form onSubmit={handleSubmit}>
                        <Box component="div"
                            sx={{ display: 'flex', justifyContent: 'space-around', mt: '1rem' }}>
                            <Box component="div">
                                <Box component="h3" sx={{ mb: 2 }}>Price quotation details</Box>
                                <table style={{ border: '1px solid gray', padding: '1rem' }}>
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
                                        <td>
                                            <TextField label="Quotation(LKR)" size="small" type='number' name='quotation' margin="normal"
                                                value={values.quotation}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.quotation && Boolean(errors.quotation)}
                                                helperText={touched.quotation && errors.quotation}
                                            /></td>
                                        <td><TextField label="Description" size="small" type='text' name='description' margin="normal"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.description && Boolean(errors.description)}
                                            helperText={touched.description && errors.description}
                                        />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> <Autocomplete
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
                                        /></td>
                                        <td>
                                            <FormControl sx={{ m: 1, minWidth: 170 }}>
                                                <InputLabel id="demo-simple-select-helper-label">Category</InputLabel>
                                                <Field
                                                    as={Select}
                                                    name="category"
                                                    value={values.category}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    label="Category"
                                                    defaultValue={'G'}
                                                    size='small'
                                                >
                                                    <MenuItem value={"G"}>G</MenuItem>
                                                    <MenuItem value={"DG"}>DG</MenuItem>
                                                    <MenuItem value={"DG-B"}>DG-B</MenuItem>
                                                </Field>
                                            </FormControl>
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
                            </Box>
                            <Box component="div">
                                <Box component="h3" sx={{ mb: 2 }}>Customer Details</Box>
                                <table style={{ border: '1px solid gray', padding: '1rem' }}>
                                    <tr>
                                        <td>
                                            <TextField label="Customer ID" size="small" type='text' name='cusID'
                                                value={customerID}
                                                onChange={(e) => setCustomerID(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Button size="medium" onClick={searchCustomer}>Search</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextField label="Name" size="small" type='text' name='name' margin="normal"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextField label="Tel number" size="small" type='text' name='tp'
                                                value={customerTp}
                                                onChange={(e) => setCustomerTp(e.target.value)}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ display: 'flex', flexDirection: 'row' }}>
                                            <Box component="p" sx={{ m: 'auto 0' }}>New customer?</Box>
                                            <Button size="medium" onClick={() => setAddCustomerOpen(true)}>Yes</Button>
                                        </td>
                                    </tr>
                                </table>
                            </Box>
                        </Box>
                        <Box component="div" sx={{ position: 'absolute', right: '8rem', bottom: '8.5rem', display: 'flex', flexDirection: 'column' }}>
                            <TextField label="ChatLink" size="small" type='text' name='chatlink'
                                value={chatLink}
                                onChange={(e) => setChatLink(e.target.value)}
                            />
                            <FormControlLabel control={<Checkbox checked={checked} onChange={handleCheckboxChange} />} label="Send Chat link" />
                        </Box>
                        <Box component="div" sx={{ position: 'absolute', right: '8rem', bottom: '5rem' }}>
                            <Button onClick={toOrders} variant="outlined"
                                sx={{ ml: '1rem' }}>
                                Cancel
                            </Button>

                            <Button variant="contained"
                                type="submit"
                                sx={{ backgroundColor: '#68DD62', ml: '1rem' }}>
                                Create order
                            </Button>
                        </Box>
                    </Form>
                </Formik>
                <div>
                    <AddCustomerModel open={isAddCustomerOpen} onClose={() => setAddCustomerOpen(false)} setCustomerID={setCustomerID} setPasscode={setPasscode}></AddCustomerModel>
                </div>
            </div>

        </>
    )

}

export default NewOrder
