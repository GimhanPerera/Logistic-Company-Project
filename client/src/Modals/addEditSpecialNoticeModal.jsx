import { Box, Button, TextField, TextareaAutosize } from "@mui/material";
import axios from "axios";
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Autheader from "../services/Autheader";


export const AddEditSpecialNoticeModal = ({ open, onClose, noticeDetails, reloadNotices }) => {

    const location = useLocation();
    const { notice, isNew } = location.state || {};
    const [loading, setLoading] = useState(true); // State to track loading status
    const navigate = useNavigate();
    //const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [expireDate, setExpireDate] = useState('');

    const initialValues = {
        title: '',
        description: '',
        expireDate: '',
    }

    const toClose = () => {
        reloadNotices();
        onClose();
    }

    useEffect(() => {
        setTitle(noticeDetails ? noticeDetails.title : '');
        setDescription(noticeDetails ? noticeDetails.description : '');
        setExpireDate(noticeDetails ? noticeDetails.expire_date : '');
        setLoading(false)
    }, [noticeDetails]);

    const handleClose = (e) => {
        if (e.target.id === 'container') {
            // setTitle(''); // Clear the text box
            // setDescription('');
            // setExpireDate('');
            reloadNotices();
            onClose();
        }
    }

    // Get today's date in the format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const onSubmit = async (values, actions) => {
        //VALIDATION SHOULD DONE HERE

        axios.post("http://localhost:3001/api/noitces/edit", {
            "notice_id": noticeDetails.notice_id,
            "title": title,
            "description": description,
            "expire_date": expireDate,
        }, {
            headers: {
                ...Autheader()
            }
        }).then((response) => {
            //setResp(response.data);
            reloadNotices();
            reloadNotices();
            onClose();
        }).catch((error) => {
            console.error('Error submitting complain:', error);
        });
    }
    const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
        initialValues: initialValues,
        //validationSchema: priceQuotationValidation,

        onSubmit,
    });


    if (loading || !open) return null;
    else if (open) return (
        <>
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
                    }}>Edit Notice ID: {noticeDetails.notice_id}</Box>
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

                    {/*Title*/}
                    <h3 style={{ marginTop: '10px' }}>Title: </h3>
                    <Box component="input"
                        sx={{
                            border: '1px solid black',
                            width: '24rem',
                            padding: '0.25rem'
                        }}
                        value={title}
                        defaultValue={title}
                        onChange={(e) => {
                            const input = e.target.value;
                            if (input.length <= 30) {
                                setTitle(input);
                            } else {
                                setTitle(input.slice(0, 30)); // Truncate input to 30 characters
                            }
                        }}
                    ></Box>

                    {/*Description*/}
                    <h3 style={{ marginTop: '5px' }}>Description: </h3>
                    <TextareaAutosize
                        style={{
                            border: '1px solid black',
                            width: '24rem',
                            padding: '0.25rem',
                            resize: 'none'
                        }}
                        minRows={3}
                        maxLength={200}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description (max 200 characters)"
                    />

                    {/*Expire Date*/}
                    <h3 style={{ marginTop: '5px' }}>Expire Date: </h3>
                    <TextField
                        type="date"
                        sx={{
                            border: '1px solid black',
                            width: '24rem',
                            padding: '0.25rem'
                        }}
                        value={expireDate}
                        onChange={(e) => setExpireDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            min: today,
                        }}
                    />
                    <div>
                        <Button onClick={onSubmit} fullWidth variant="contained" sx={{ mt: 3, mb: 1, border: '1px solid #1E90FF' }}>Edit</Button><br />
                        <Button onClick={toClose} fullWidth variant="contained" sx={{ mt: 0, mb: 2, border: '1px solid #1E90FF', color: '#1E90FF', backgroundColor: 'white' }}>Cancel</Button>
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
    else return null;
};

