import { Box, Button } from '@mui/material';
import axios from "axios";
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { addCustomerValidation } from '../validations';

export default function AddCustomerModel({ open, onClose, setCustomerID }) {
    const [nicFront, setNicFront] = useState(null);
    const handleNicFrontChange = (e) => {
        setNicFront( e.target.files[0]); // Update the image file in the form data
    };
    const [nicBack, setNicBack] = useState(null);
    const handleNicBackChange = (e) => {
        setNicBack( e.target.files[0]); // Update the image file in the form data
    };
    const onSubmit = async (values, actions) => { //Submition here
        //e.preventDefault;
        const customerData = {
            f_name: values.f_name,
            l_name: values.l_name,
            tel_number: values.tel_number,
            address: values.address,
            nic: values.nic,
            nicFront: nicFront,
            nicBack: nicBack
        }
        console.log(customerData)
        axios.post("http://localhost:3001/api/customers", customerData ,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        ).then((response) => {
            //alert("New customer " + response.data.cus_id + " added")
            setCustomerID(response.data.cus_id);
            onClose();
            setErrors({});
            clearFields();
        }).catch((error) => {
            console.error('Error submitting complain:', error);
        });
        //values.f_name : value of f_name
        actions.resetForm(); //Reset the form
    }
    const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
        initialValues: {
            f_name: '',
            l_name: '',
            tel_number: '',
            address: '',
            nic: ''
        },
        validationSchema: addCustomerValidation,
        onSubmit,
    });


    const [customerData, setCustomerData] = useState({
        f_name: '',
        l_name: '',
        tel_number: 0,
        address: '',
        nic: ''
    });
    const clearFields = (e) => {
        setCustomerData({
            f_name: '',
            l_name: '',
            tel_number: 0,
            address: '',
            nic: ''
        })
    }
    const handleClose = (e) => {
        if (e.target.id === 'container') {
            onClose();
            setErrors({})
            clearFields()
        }
    }
    const clickCloseBtn = () => {
        onClose(); setErrors({})
        clearFields()
    }


    if (!open) return null;
    return (
        <>
            {/*Card*/}
            <Box component="div"
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '2rem',
                    zIndex: 50
                }}
            >
                <Box component="h4"
                    sx={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                    }}>Add customer</Box>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tr>
                            <td><label>First name :</label></td>
                            <td><input
                                type='text'
                                name='f_name'
                                value={values.f_name}
                                onChange={handleChange}
                                id="f_name"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.f_name && touched.f_name ? <small style={{ color: 'red' }}>{errors.f_name}</small> : null}</tr>
                        <tr>
                            <td><label>Last name :</label></td>
                            <td><input
                                type='text'
                                name='l_name'
                                value={values.l_name}
                                onChange={handleChange}
                                id="l_name"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.l_name && touched.l_name ? <small style={{ color: 'red' }}>{errors.l_name}</small> : null}</tr>
                        <tr>
                            <td><label>Tel. Number :</label></td>
                            <td><input
                                type='text'
                                name='tel_number'
                                value={values.tel_number}
                                onChange={handleChange}
                                id="tel_number"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.tel_number && touched.tel_number ? <small style={{ color: 'red' }}>{errors.tel_number}</small> : null}</tr>
                        <tr>
                            <td><label>Address :</label></td>
                            <td><input
                                type='text'
                                name='address'
                                value={values.address}
                                onChange={handleChange}
                                id="address"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.address && touched.address ? <small style={{ color: 'red' }}>{errors.address}</small> : null}</tr>
                        <tr>
                            <td><label>NIC :</label></td>
                            <td><input
                                type='text'
                                name='nic'
                                value={values.nic}
                                onChange={handleChange}
                                id="nic"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.nic && touched.nic ? <small style={{ color: 'red' }}>{errors.nic}</small> : null}</tr>
                        <tr>
                            <td><label for="nicBack">NIC front picture :</label></td>
                            <td>
                                <input type="file" name="nicFront" onChange={handleNicFrontChange} accept="image/*"
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
                            <td><label for="nicBack">NIC back picture :</label></td>
                            <td>
                                <input type="file" name="nicBack" onChange={handleNicBackChange} accept="image/*"
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        marginTop: '10px',
                                        width: '200px',
                                    }}
                                />
                            </td>
                        </tr>
                    </table>
                    <Button type='submit' fullWidth variant="contained" sx={{ mt: 3, mb: 1, border: '1px solid #1E90FF' }}>Submit</Button><br />
                    <Button onClick={clickCloseBtn} fullWidth variant="contained" sx={{ mt: 0, mb: 2, border: '1px solid #1E90FF', height: '2.0rem', color: '#1E90FF', backgroundColor: 'white' }}>Cancel</Button>
                </form>

            </Box>

            {/*Background*/}
            <Box component="div"
                id='container' onClick={handleClose}
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // black with 70% opacity
                    zIndex: 40
                }}
            />
        </>
    )
}

//NOTE
//textarea and paragragh width make the card width
