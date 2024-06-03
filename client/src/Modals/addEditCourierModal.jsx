import { Box, Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Autheader from "../services/Autheader";

export default function AddEditCourierModal({ open, onClose,courierDetails,reloadCouriers  }) {
    const [resp, setResp] = useState();
    const [nameField, setNameField] = useState('');
    const [tpFields, setTpFields] = useState('');
    const token = localStorage.getItem('token');
    useEffect(()=>{
        setNameField(courierDetails? courierDetails.name : '');
        setTpFields(courierDetails? `0${courierDetails.tel_number}` : '');
    },[courierDetails])

    const handleClose = (e) => {
        if (e.target.id === 'container') {
            setNameField(''); // Clear the text box
            setTpFields('')
            onClose();
        }
    }
    const clickCloseBtn = () => {
        setNameField(''); // Clear the text box
        setTpFields('')
        onClose();
    }

    const addCourier = () => {

        //VALIDATION SHOULD DONE HERE
        //alert(tpFields + " Adding " + nameField)
        axios.post("http://localhost:3001/api/courier", {
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
        });
    }

    const editCourier = () => {
        console.log("TP: " + tpFields)
        //VALIDATION SHOULD DONE HERE

        axios.post("http://localhost:3001/api/courier/edit", {
            "courier_id": open,
            "name": nameField,
            "tel_number": tpFields
        }, {
            headers: {
                ...Autheader()
            }
        }).then((response) => {
            setResp(response.data);
            setNameField(''); // Clear the text box
            setTpFields('');
            reloadCouriers();
            onClose();
        }).catch((error) => {
            console.error('Error submitting complain:', error);
        });
    }


    if (open == 'add') return (
        <>
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
                    <p>Tel number: </p>
                    <Box component="input"
                        sx={{
                            border: '1px solid black',
                            width: '24rem',
                            padding: '0.25rem'
                        }}
                        value={tpFields}
                        onChange={(e) => setTpFields(e.target.value)}
                    ></Box>
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
    else if (open == 'false') return null;
    //else if (nameField=='') return null;
    else return (
        <>
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
                    <Box
                        component="p" sx={{
                        }}>Courier ID: {open}</Box>
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
                    <p>Tel number: </p>
                    <Box component="input"
                        sx={{
                            border: '1px solid black',
                            width: '24rem',
                            padding: '0.25rem'
                        }}
                        value={tpFields}
                        onChange={(e) => setTpFields(e.target.value)}
                    ></Box>
                    <div>
                        <Button onClick={editCourier} fullWidth variant="contained" sx={{ mt: 3, mb: 1, border: '1px solid #1E90FF' }}>Edit</Button><br />
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
