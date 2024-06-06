import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from "axios";
import { Field, Form, Formik, useFormik } from 'formik';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Autheader from "../../../services/Autheader";
//import { employeeFormValidation } from '../../validations';
import Swal from 'sweetalert2';

export const EditEmployee = () => {
    const location = useLocation();
    const { empData } = location.state || {};

    const [profileDetails, setProfileDetails] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [orderIds, setOrderIds] = useState([]);

    const initialValues = {
        f_name: empData.f_name,
        l_name: empData.l_name,
        nic: empData.nic,
        email: empData.email,
        tel_number: empData.tel_number,
        status: empData.status,
        position: empData.position,
    }

    const navigate = useNavigate();

    const onSubmit = async (values, actions) => {
        console.log("Submitted");
        { empData.emp_id == '' ? 'Add' : 'Save Changes' }
        let url = 'edit';
        let msg = `Employee ${empData.emp_id} Updated`;
        if (empData.emp_id == '') {
            url = 'new';
            msg = 'New employee added';
        }
        axios.post(`http://localhost:3001/api/employee/${url}`, {
            "emp_id": empData.emp_id,
            "f_name": values.f_name,
            "l_name": values.l_name,
            "nic": values.nic,
            "email": values.email,
            "tel_number": values.tel_number,
            "status": values.status,
            "position": values.position,
        }, {
            headers: {
                ...Autheader()
            }
        })
            .then((response) => {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: msg
                });

                navigate('../.');
            })
            .catch((error) => {
                console.error("Error :", error.message);
            });
    }

    const toBack = () => {
        navigate('../.');
    }

    const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
        initialValues: initialValues,
        //validationSchema: employeeFormValidation,

        onSubmit,
    });

    return (
        <>
            <Box component='h2' sx={{ textAlign: 'center' }}>{empData.emp_id == '' ? 'New Employee' : `Employee ID: ${empData.emp_id}`}</Box>
            <Box component='div' sx={{ mt: '2rem' }}>
                <div className="relative">
                    <Formik>
                        <Form onSubmit={handleSubmit}>
                            <Box component="div"
                                sx={{ display: 'flex', justifyContent: 'space-around', mt: '1rem' }}>
                                <Box component="div" style={{ border: '1px solid gray', padding: '1rem' }}>
                                    {/* <Box component="h3" sx={{ mb: 2, textAlign: 'center' }}>Employee Details</Box> */}
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <TextField label="First Name" size="small" type='text' name='f_name' margin="normal"
                                                        value={values.f_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.f_name && Boolean(errors.f_name)}
                                                        helperText={touched.f_name && errors.f_name}
                                                        initialValues={values.f_name}
                                                        sx={{ mr: '1rem' }}
                                                    />
                                                </td>
                                                <td>
                                                    <TextField label="Last Name" size="small" type='text' name='l_name' margin="normal"
                                                        value={values.l_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.l_name && Boolean(errors.l_name)}
                                                        helperText={touched.l_name && errors.l_name}
                                                        initialValues={values.l_name}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <TextField label="NIC" size="small" type='text' name='nic' margin="normal"
                                                        value={values.nic}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.nic && Boolean(errors.nic)}
                                                        helperText={touched.nic && errors.nic}
                                                        initialValues={values.nic}
                                                    />
                                                </td>
                                                <td>
                                                    <TextField label="Tel Number" size="small" type='number' name='tel_number' margin="normal"
                                                        value={values.tel_number}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.tel_number && Boolean(errors.tel_number)}
                                                        helperText={touched.tel_number && errors.tel_number}
                                                        initialValues={values.tel_number}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <TextField label="Email" size="small" type='text' name='email' margin="normal"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.email && Boolean(errors.email)}
                                                        helperText={touched.email && errors.email}
                                                        initialValues={values.email}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <FormControl sx={{ m: 1, minWidth: 170 }}>
                                                        <InputLabel>Position</InputLabel>
                                                        <Field
                                                            as={Select}
                                                            name="position"
                                                            value={values.position}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            label="Position"
                                                            size='small'
                                                            initialValues={values.position}
                                                        >
                                                            {/* <MenuItem value={"new"}>New</MenuItem> */}
                                                            <MenuItem value={"MANAGER"}>Manager</MenuItem>
                                                            <MenuItem value={"EMP"}>employee</MenuItem>
                                                        </Field>
                                                    </FormControl>
                                                </td>
                                                <td>
                                                    <FormControl sx={{ m: 1, minWidth: 170 }}>
                                                        <InputLabel>Status</InputLabel>
                                                        <Field
                                                            as={Select}
                                                            name="status"
                                                            value={values.status}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            label="Status"
                                                            size='small'
                                                            initialValues={values.status}
                                                        >
                                                            {/* <MenuItem value={"new"}>New</MenuItem> */}
                                                            <MenuItem value={"active"}>Active</MenuItem>
                                                            <MenuItem value={"blocked"}>Block</MenuItem>
                                                            <MenuItem value={"deleted"}>Delete</MenuItem>
                                                        </Field>
                                                    </FormControl>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <Box component="div" sx={{}}>
                                        <Button variant="outlined"
                                            onClick={toBack}
                                        >
                                            Back
                                        </Button>
                                        <Button variant="contained"
                                            type="submit"
                                            sx={{ backgroundColor: '#68DD62', ml: '1rem' }}>
                                            {empData.emp_id == '' ? 'Add' : 'Save Changes'}
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Form>
                    </Formik>
                </div>
            </Box>
        </>
    );
};

