import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";
import { Field, Form, Formik, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Countries } from '../../../countryCodes';


const RequestHandle = () => {




    const [dropDownValue, setDropDownValue] = React.useState("Ship cargo");

    const dropDownChange = (event) => {
        setDropDownValue(event.target.value);

    };
    const [customerID, setCustomerID] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerTp, setCustomerTp] = useState("");
    const [image, setImage] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const navigate = useNavigate();
    const [quotationID, setQuotationID] = useState();
    const [quotationDetails, setQuotationDetails] = useState([]);
    const [initialValues, setInitialValues] = useState([]);
    const [formdata, setFormData] = useState([]);

    const [items, setItems] = useState();
    const [packages, setPackages] = useState();
    const [weight, setWeight] = useState();
    const [shippingmethod, setShippingmethod] = useState();
    const [quotation, setQuotation] = useState('22');
    const [description, setDescription] = useState();
    const [supplierLoc, setSupplierLoc] = useState();

    useEffect(() => {
        //Get customer data
        // Get the URL path
        const path = window.location.pathname;

        // Split the path by '/'
        const parts = path.split('/');

        // Get the last part of the path
        setQuotationID(parts[parts.length - 1]);
        console.log("QID: " + parts[parts.length - 1])
        axios.get(`http://localhost:3001/api/customers/searchby/quotation/${parts[parts.length - 1]}`, {
        }).then((response) => {
            setCustomerID(response.data.customer_id);
            setCustomerName(response.data.name);
            setCustomerTp(response.data.tel_number);
            console.log(response.data.name);
        }).catch((error) => {
            console.error('Error :', error);
        });
        axios.get(`http://localhost:3001/api/priceQuotationRouter/searchby/id/${parts[parts.length - 1]}`, {
        }).then((response) => {
            setQuotationDetails(response.data.priceReq[0])
            //initialValues.weight=response.data.priceReq[0].raugh_weight
            //console.log(response.data.priceReq[0])
            setItems(response.data.priceReq[0].items);
            setPackages(response.data.priceReq[0].no_of_packages);
            setWeight(response.data.priceReq[0].raugh_weight);
            setShippingmethod(response.data.priceReq[0].shipping_method);
            setDescription(response.data.priceReq[0].description);
            setSupplierLoc(response.data.order[0].supplier_loc);
            //setPackages(response.data.priceReq[0].no_of_packages);
        }).catch((error) => {
            console.error('Error :', error);
        });
    }, [])

    // useEffect(() => {
    //     // Check if quotationDetails is set
    //     if (quotationDetails) {
    //         console.log("ITM: " + quotationDetails.items)
    //         // Update initialValues with data from quotationDetails
    //         setInitialValues({
    //             items: 'sdsd',
    //             packages: '4',
    //             weight: '2',
    //             shippingmethod: '',
    //             quotation: '',
    //             description: '',
    //             supplierLoc: '',
    //         });
    //     }
    // }, [quotationDetails]);

    const toOrders = () => {
        navigate('../order');
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Update the image file in the form data
    };
    const handleInvoiceChange = (e) => {
        setInvoice(e.target.files[0]); // Update the image file in the form data

    };

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

        try {
            const token = localStorage.getItem('token');
            await axios.post("http://localhost:3001/api/order", {
                "items": values.items,
                "packages": values.packages,
                "weight": values.weight,
                "shippingmethod": values.shippingmethod,
                "quotation": values.quotation,//
                "description": values.description,
                "supplierLoc": "China",//values.supplierLoc,
                "status": "Just opened",//
                "image": image,
                "invoice": invoice,
                "cusID": customerID,
                "name": customerName,//
                "tp": customerTp,//
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            navigate('../order');
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }
    const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
        initialValues: initialValues,
        //validationSchema: priceQuotationValidation,

        onSubmit,
    });


    return (
        <>
            <ToastContainer />
            <div className="relative">
                <Formik>
                    <Form>
                        <Box component="div"
                            sx={{ display: 'flex', justifyContent: 'space-around', mt: '1rem' }}>
                            <Box component="div">
                                <Box component="h3" sx={{ mb: 2 }}>Price quotation details</Box>
                                <table style={{ border: '1px solid gray', padding: '1rem' }}>
                                    <tr>
                                        <td>
                                            <TextField label="Items" size="small" type='text' name='items' margin="normal"
                                                value={items}
                                                onChange={(e) => setItems(e.target.value)}
                                            //onBlur={handleBlur}
                                            //error={touched.items && Boolean(errors.items)}
                                            //helperText={touched.items && errors.items}
                                            />
                                        </td>
                                        <td>
                                            <TextField label="No of packages" size="small" type='number' name='packages' margin="normal"
                                                //value={values.packages}
                                                //onChange={handleChange}
                                                value={packages}
                                                onChange={(e) => setPackages(e.target.value)}
                                            // onBlur={handleBlur}
                                            // error={touched.packages && Boolean(errors.packages)}
                                            // helperText={touched.packages && errors.packages}
                                            /></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextField label="Rough weight(Kg)" size="small" type='number' name='weight' margin="normal"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                            // onBlur={handleBlur}
                                            // error={touched.weight && Boolean(errors.weight)}
                                            // helperText={touched.weight && errors.weight}
                                            /></td>
                                        <td>
                                            <FormControl sx={{ m: 1, minWidth: 170 }}>
                                                <InputLabel id="demo-simple-select-helper-label">Shipping method</InputLabel>
                                                <Field
                                                    as={Select}
                                                    name="shippingmethod"
                                                    onChange={(e) => setShippingmethod(e.target.value)}
                                                    value={shippingmethod}
                                                    //onBlur={handleBlur}
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
                                                value={quotation}
                                                onChange={(e) => setQuotation(e.target.value)}
                                            // onBlur={handleBlur}
                                            // error={touched.quotation && Boolean(errors.quotation)}
                                            // helperText={touched.quotation && errors.quotation}
                                            /></td>
                                        <td><TextField label="Description" size="small" type='text' name='description' margin="normal"
                                            //value={values.description}
                                            //onChange={handleChange}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        // onBlur={handleBlur}
                                        // error={touched.description && Boolean(errors.description)}
                                        // helperText={touched.description && errors.description}
                                        />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> <Autocomplete
                                            id="country-select-demo"
                                            sx={{ width: 250, mt: 2, mb: 2 }}
                                            options={Countries}
                                            autoHighlight
                                            defaultValue={Countries.find((country) => country.label === 'China')}
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
                                                    name='supplierLoc'
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                                    }}
                                                    value={supplierLoc}
                                                onChange={(e) => setSupplierLoc(e.target.value)}
                                                />
                                            )}
                                        /></td>
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
                                            <TextField disabled label="Customer ID" size="small" type='text' name='cusID'
                                                value={customerID}
                                                onChange={(e) => setCustomerID(e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextField disabled label="Name" size="small" type='text' name='name' margin="normal"
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
                                            <TextField disabled label="Tel number" size="small" type='text' name='tp'
                                                value={customerTp}
                                                onChange={(e) => setCustomerTp(e.target.value)}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />

                                        </td>
                                    </tr>
                                </table>
                            </Box>
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
            </div>

        </>
    )

}

export default RequestHandle
