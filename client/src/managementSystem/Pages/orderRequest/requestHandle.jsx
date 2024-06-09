import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from "axios";
import FileSaver from 'file-saver';
import { Field, Form, Formik, useFormik } from 'formik';
import FileDownload from "js-file-download";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { Countries } from '../../../countryCodes';
import Autheader from "../../../services/Autheader";
import { priceQuotationValidation } from '../../../validations';

const RequestHandle = () => {
    const location = useLocation();
    const { order_id, quotation_id, itemsP, packCountP, weightP, shippingMarkP, desP, countryP } = location.state || {};

    const initialValues = {
        items: itemsP,
        packages: packCountP,
        weight: weightP,
        shippingmethod: shippingMarkP,
        category: 'G',
        quotation: '',
        description: desP,
        supplierLoc: countryP,
    }

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
    const [addImage, setaddImage] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState(Countries.find((country) => country.label === countryP));
    const [chatLink, setChatLink] = useState('');
    const [checked, setChecked] = React.useState(false);
    const toggleAddImage = () => {
        setaddImage(addImage => !addImage);
    };
    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

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
        try {
            axios({
                url: `http://localhost:3001/api/priceQuotationRouter/download/image/${quotation_id}`,
                method: "GET",
                responseType: "blob"
            }).then((res) => {
                // Get the content type from the response headers
                const contentType = res.headers['content-type'];

                console.log("TYPE", contentType)

                // Determine the file extension based on the content type
                let extension = '';
                if (contentType === 'application/pdf') {
                    extension = 'pdf';
                } else if (contentType.startsWith('image/')) {
                    // Get the image type from the content type
                    extension = contentType.split('/')[1];
                } else {
                    console.error('Unsupported file type');
                    return;
                }

                // Optionally, set the image state if needed for further processing
                setImage(URL.createObjectURL(res.data));
            })
        } catch (error) {
            console.error('Error creating order:', error);
        }

    }, [])

    const toOrders = () => {
        navigate('../');
    }

    const deleteRequest = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3001/api/priceQuotationRouter/${quotation_id}`, {
                }).then((response) => {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    navigate('../');
                }).catch((error) => {
                    console.error('Error :', error);
                });

            }
        });


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
        } if (image == null) {
            toast.error("Image is required");
            return
        }
        // if (invoice == null) {
        //     toast.error("Invoice is required");
        //     return
        // }
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
                    await axios.post("http://localhost:3001/api/order/requestconfirm", {
                        "order_id": order_id,
                        "quotation_id": quotation_id,
                        "items": values.items,
                        "packages": values.packages,
                        "weight": values.weight,
                        "shippingmethod": values.shippingmethod,
                        "category": values.category,
                        "quotation": values.quotation,
                        "description": values.description,
                        "supplierLoc": selectedCountry.label,
                        "status": "Just opened",
                        "chatLink": checked ? chatLink : '',
                        "cusID": customerID,
                        // "name": customerName,//
                        // "tp": customerTp,//
                    }, {
                        headers: {
                            //'Content-Type': 'multipart/form-data',
                            ...Autheader()
                        }
                    });
                    Swal.fire({
                        title: `Order ${order_id} created`,
                        icon: "success"
                    });
                    navigate('../');
                } catch (error) {
                    console.error('Error creating order:', error);
                    toast.error('Something wrong. Please check the inputs')
                }
            }
        });


    }

    const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
        initialValues: initialValues,
        validationSchema: priceQuotationValidation,

        onSubmit,
    });

    const downloadImage = async (e) => {
        e.preventDefault();
        try {
            axios({
                url: `http://localhost:3001/api/priceQuotationRouter/download/image/${quotation_id}`,
                method: "GET",
                responseType: "blob"
            }).then((res) => {
                // Get the content type from the response headers
                const contentType = res.headers['content-type'];

                console.log("TYPE", contentType)

                // Determine the file extension based on the content type
                let extension = '';
                if (contentType === 'application/pdf') {
                    extension = 'pdf';
                } else if (contentType.startsWith('image/')) {
                    // Get the image type from the content type
                    extension = contentType.split('/')[1];
                } else {
                    console.error('Unsupported file type');
                    return;
                }

                // Create a filename with the appropriate extension
                const filename = `${quotation_id}Image.${extension}`;

                // Save the file using FileSaver
                FileSaver.saveAs(new Blob([res.data], { type: contentType }), filename);

                // Optionally, set the image state if needed for further processing
                setImage(URL.createObjectURL(res.data));
            })
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }

    const downloadInvoice = async (e) => {
        e.preventDefault();
        try {
            axios({
                url: `http://localhost:3001/api/priceQuotationRouter/download/invoice/${quotation_id}`,
                method: "GET",
                responseType: "blob"
            }).then((res) => {
                // Get the content type from the response headers
                const contentType = res.headers['content-type'];

                //console.log("TYPE", contentType)

                // Determine the file extension based on the content type
                let extension = '';
                if (contentType === 'application/pdf') {
                    extension = 'pdf';
                } else if (contentType.startsWith('image/')) {
                    // Get the image type from the content type
                    extension = contentType.split('/')[1];
                } else {
                    console.error('Unsupported file type');
                    return;
                }

                // Create a filename with the appropriate extension
                const filename = `${quotation_id}Invoice.${extension}`;
                FileDownload(res.data, filename)
            })
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }


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
                                                initialValues={values.items}
                                            />
                                        </td>
                                        <td>
                                            <TextField label="No of packages" size="small" type='number' name='packages' margin="normal"
                                                value={values.packages}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.packages && Boolean(errors.packages)}
                                                helperText={touched.packages && errors.packages}
                                                initialValues={values.packages}
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
                                                initialValues={values.weight}
                                            /></td>
                                        <td>
                                            <FormControl sx={{ m: 1, minWidth: 170 }}>
                                                <InputLabel>Shipping method</InputLabel>
                                                <Field
                                                    as={Select}
                                                    name="shippingmethod"
                                                    value={values.shippingmethod}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    label="Shipping method"
                                                    size='small'
                                                    initialValues={values.shippingmethod}
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
                                        <Box component='td' sx={{
                                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                                        }}><TextField label="Description" size="small" type='text' name='description' margin="normal"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.description && Boolean(errors.description)}
                                            helperText={touched.description && errors.description}
                                            initialValues={values.description}
                                            multiline
                                            maxRows={4}
                                            />
                                        </Box>
                                    </tr>
                                    <tr>
                                        <td> <Autocomplete
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

                                            {addImage ? (
                                                <div>
                                                    {image && (
                                                        <div style={{ marginTop: '10px' }}>
                                                            <img
                                                                src={image}
                                                                alt="Preview"
                                                                style={{ width: '200px', borderRadius: '5px' }}
                                                            />
                                                        </div>
                                                    )}
                                                    <Box component="p" onClick={downloadImage} style={{ cursor: 'pointer', color: 'blue' }}>
                                                        Download
                                                    </Box>
                                                    {/* <Box component="p"onClick={toggleAddImage} style={{ cursor: 'pointer', color: 'blue' }}>
                                                        add new image
                                                    </Box> */}
                                                </div>
                                            ) : (
                                                <div>
                                                    <Field
                                                        type="file"
                                                        id="image"
                                                        name="image"
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                        style={{
                                                            border: '1px solid #ccc',
                                                            padding: '10px',
                                                            borderRadius: '5px',
                                                            marginTop: '10px',
                                                            width: '200px',
                                                        }}
                                                    />
                                                    <Box component="p" onClick={toggleAddImage} style={{ cursor: 'pointer', color: 'blue' }}>
                                                        cancel
                                                    </Box></div>
                                            )}

                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label for="invoice">Performa invoice :</label></td>
                                        <td>
                                            <Box component="p" onClick={(e) => downloadInvoice(e)}>Download</Box>
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
                        <Box component="div" sx={{ position: 'absolute', right: '8rem', bottom: '9rem', display: 'flex', flexDirection: 'column' }}>
                            <TextField label="ChatLink" size="small" type='text' name='chatlink'
                                value={chatLink}
                                onChange={(e) => setChatLink(e.target.value)}
                            />
                            <FormControlLabel control={<Checkbox checked={checked} onChange={handleCheckboxChange} />} label="Send Chat link" />
                        </Box>

                        <Box component="div" sx={{ position: 'absolute', right: '5rem', bottom: '5rem' }}>
                            <Button onClick={toOrders} variant="outlined"
                                sx={{ ml: '1rem' }}>
                                Back
                            </Button>
                            <Button variant="outlined" color="error" sx={{ ml: '1rem' }} onClick={deleteRequest}>
                                Delete
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
