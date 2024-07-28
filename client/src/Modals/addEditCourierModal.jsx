import { Box, Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Autheader from "../services/Autheader";
import { courierFormValidation } from './../validations'; //validations

//add or edit courier service data
export default function AddEditCourierModal({ open, onClose, courierDetails, reloadCouriers }) {
    const [resp, setResp] = useState();
    const [nameField, setNameField] = useState('');//name
    const [tpFields, setTpFields] = useState('');//telephone number
    const [errors, setErrors] = useState({});//errors
    const token = localStorage.getItem('token');

    //set courier name and telephone number
    useEffect(() => {
        setNameField(courierDetails ? courierDetails.name : '');
        setTpFields(courierDetails ? `0${courierDetails.tel_number}` : '');
    }, [courierDetails])

    //handle modal close
    const handleClose = (e) => {
        if (e.target.id === 'container') {
            setNameField(''); // Clear the text box
            setTpFields('')
            reloadCouriers();
            onClose();
            setErrors({});
        }
    }

    //when click cllose button
    const clickCloseBtn = () => {
        setNameField(''); // Clear the text box
        setTpFields('')
        onClose();
        setErrors({});
    }

    //add a courier
    const addCourier = () => {
        //validations
        courierFormValidation
            .validate({ nameField, tpFields }, { abortEarly: false })
            .then(() => {
                setErrors({});
                //console.log("DIDDDD")
                //alert(tpFields + " Adding " + nameField)
                axios.post("http://localhost:3001/api/courier", {//add a courier
                    name: nameField,
                    tel_number: tpFields
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((response) => {
                    setResp(response.data);
                    setNameField(''); // Clear the text box
                    setTpFields('')
                    onClose();
                }).catch((error) => {
                    console.error('Error submitting complain:', error);
                    toast.error(error.response.data.error);
                });
            })
            .catch((err) => {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setErrors(newErrors);
                return
            });
    }

    //edit existing courier
    const editCourier = () => {
        //validations
        courierFormValidation
            .validate({ nameField, tpFields }, { abortEarly: false })
            .then(() => {
                setErrors({});
                axios.post("http://localhost:3001/api/courier/edit", {//send edit data to database
                    "courier_id": open,
                    "name": nameField,
                    "tel_number": tpFields
                }, {
                    headers: {
                        ...Autheader()
                    }
                }).then((response) => {
                    setResp(response.data);
                    setNameField('');   // Clear the name box
                    setTpFields('');    // Clear the telephone box
                    reloadCouriers();   //reload courier data
                    onClose();
                }).catch((error) => {
                    console.error('Error submitting complain:', error);
                    toast.error(error.response.data.error);
                });
            })
            .catch((err) => {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setErrors(newErrors);
                return
            });
    }


    //if need to add a courier
    if (open == 'add') return (
        <><ToastContainer></ToastContainer>
            {/*Add Card*/}
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
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                    }}>Add a Courier</Box>
                <Box
                    component="hr"
                    sx={{
                        height: '0.25rem',
                        marginTop: '0.5rem',
                        marginBottom: '0.5rem',
                        backgroundColor: 'gray'
                    }}
                ></Box>
                <div>
                    <p>Name: </p>
                    <Box component="input"
                        sx={{
                            border: '1px solid black',
                            width: '24rem',
                            padding: '0.25rem'
                        }}
                        value={nameField}
                        onChange={(e) => setNameField(e.target.value)}
                    ></Box>
                    {errors.nameField && <p style={{ color: 'red' }}>{errors.nameField}</p>}
                    <p style={{ marginTop: '0.5rem' }}>Tel number: </p>
                    <Box component="input"
                        sx={{
                            border: '1px solid black',
                            width: '24rem',
                            padding: '0.25rem'
                        }}
                        value={tpFields}
                        onChange={(e) => setTpFields(e.target.value)}
                    ></Box>
                    {errors.tpFields && <p style={{ color: 'red' }}>{errors.tpFields}</p>}
                    <div>
                        <Button onClick={addCourier} fullWidth variant="contained" sx={{ mt: 3, mb: 1, border: '1px solid #1E90FF' }}>Add</Button><br />
                        <Button onClick={clickCloseBtn} fullWidth variant="contained" sx={{ mt: 0, mb: 2, border: '1px solid #1E90FF', color: '#1E90FF', backgroundColor: 'white' }}>Cancel</Button>
                    </div>
                </div>
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
    //Close the modal
    else if (open == 'false') return null;
    //else if (nameField=='') return null;
    //if need to edit a existing courier
    else return (
        <><ToastContainer></ToastContainer>
            {/*Edit courier Card*/}
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
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                    }}>Edit a Courier</Box>
                <Box
                    component="hr"
                    sx={{
                        height: '0.25rem', // Equivalent to h-1 in Tailwind
                        marginTop: '0.5rem', // Equivalent to mt-2 in Tailwind
                        marginBottom: '0.5rem',
                        backgroundColor: 'gray'
                    }}
                ></Box>
                <div>
                    {/* Courier ID */}
                    <Box
                        component="p" sx={{
                        }}>Courier ID: {open}
                        </Box>
                        {/* Name */}
                    <p>Name: </p>
                    <Box component="input"
                        sx={{
                            border: '1px solid black',
                            width: '24rem',
                            padding: '0.25rem'
                        }}
                        value={nameField}
                        defaultValue={courierDetails.name}
                        onChange={(e) => setNameField(e.target.value)}
                    ></Box>
                    {errors.nameField && <p style={{ color: 'red' }}>{errors.nameField}</p>}

                    {/* Telephone number */}
                    <p style={{ marginTop: '0.5rem' }}>Tel number: </p>
                    <Box component="input"
                        sx={{
                            border: '1px solid black',
                            width: '24rem',
                            padding: '0.25rem'
                        }}
                        value={tpFields}
                        onChange={(e) => setTpFields(e.target.value)}
                    ></Box>
                    {errors.tpFields && <p style={{ color: 'red' }}>{errors.tpFields}</p>}
                    <div>
                        {/* Edit button */}
                        <Button onClick={editCourier} fullWidth variant="contained" sx={{ mt: 3, mb: 1, border: '1px solid #1E90FF' }}>Edit</Button><br />
                        {/* Cancel button */}
                        <Button onClick={clickCloseBtn} fullWidth variant="contained" sx={{ mt: 0, mb: 2, border: '1px solid #1E90FF', color: '#1E90FF', backgroundColor: 'white' }}>Cancel</Button>
                    </div>
                </div>

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
