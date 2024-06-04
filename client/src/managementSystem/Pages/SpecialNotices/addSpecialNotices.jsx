import { Box, Button, TextField, TextareaAutosize } from "@mui/material";
import axios from "axios";
import { Form, Formik, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Autheader from "../../../services/Autheader";
const initialValues = {
    title: '',
    description: '',
    expireDate: '',
}

export const AddSpecialNotices = () => {

    const location = useLocation();
    //const { notice, isNew } = location.state || {};
    const [loading, setLoading] = useState(true); // State to track loading status
    const [orderIds, setOrderIds] = useState([]);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const toBack = () => {
        navigate('./..');
    }

    const onSubmit = async (values, actions) => {
        try {
            await axios.post("http://localhost:3001/api/noitces/add", {
                "title": values.title,
                "description": values.description,
                "expireDate": values.expireDate,
            }, {
                headers: {
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
        //validationSchema: priceQuotationByCustomerValidation,
        onSubmit,
    });

    useEffect(() => {
        setLoading(false);
    }, [])

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    if (loading) return null;
    else
        return (
            <>
                {/* <Button onClick={toBack}>Back</Button> */}
                <div>
                    <Formik>
                        <Form onSubmit={handleSubmit}>
                            <Box component="div"
                                sx={{ display: 'flex', justifyContent: 'space-around', mt: '1rem' }}>
                                <Box component="div" sx={{ border: '1px solid gray', p: '1rem', mb: '1rem' }}>
                                    <Box component="h3" sx={{ mb: 2, textAlign: 'center' }}>Add Special notice to the website</Box>
                                    <table style={{}}>
                                        <tr>
                                            <td>
                                                <TextField label="Title" size="small" type='text' name='title' margin="normal"
                                                    value={values.title}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.title && Boolean(errors.title)}
                                                    helperText={touched.title && errors.title}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Box margin="normal">
                                                    <label>Description</label><br />
                                                    <TextareaAutosize
                                                        name="description"
                                                        value={values.description}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        maxLength={200}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            borderRadius: '4px',
                                                            borderColor: touched.description && Boolean(errors.description) ? 'red' : 'initial',
                                                            border: '1px solid #ced4da',
                                                        }}
                                                        placeholder="Enter description (max 200 characters)"
                                                    />
                                                    {touched.description && errors.description && (
                                                        <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>
                                                    )}
                                                </Box>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <TextField
                                                    label="Expire Date"
                                                    size="small"
                                                    type="date"
                                                    name="expireDate"
                                                    margin="normal"
                                                    value={values.expireDate}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.expireDate && Boolean(errors.expireDate)}
                                                    helperText={touched.expireDate && errors.expireDate}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    inputProps={{
                                                        min: minDate,
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    </table>
                                    <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Button variant="contained"
                                            type="submit"
                                            sx={{ backgroundColor: '#68DD62', m: '1rem 0' }}>
                                            Save
                                        </Button>
                                        <Button onClick={toBack} variant="outlined"
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
        );
};

