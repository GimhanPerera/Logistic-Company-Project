import { Box, Button, TextField } from '@mui/material';
import axios from "axios";
import { Form, Formik, useFormik } from 'formik';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Autheader from "../../services/Autheader";
import { employeeFormValidation } from '../../validations';

//Profile page
export const ProfilePage = () => {
    const location = useLocation();
    const { empData } = location.state || {};

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    let filters = ["waiting", "completed"];

    const [profileDetails, setProfileDetails] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [orderIds, setOrderIds] = useState([]);
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [newPwdC, setNewPwdC] = useState('');

    //Error variables
    const [oldPwdError, setOldPwdError] = useState('');
    const [newPwdError, setNewPwdError] = useState('');
    const [newPwdCError, setNewPwdCError] = useState('');

    //Initial Value
    const initialValues = {
        f_name: empData.f_name,
        l_name: empData.l_name,
        nic: empData.nic,
        tel_number: empData.tel_number,
        email: empData.email
    }

    //Change password
    const changePWD = () => {
        // validations
        let valid = true;

        if (!oldPwd) {//Check old pwd field is empty
            setOldPwdError('Old Password is required');
            valid = false;
        }

        if (!newPwd) {//Check new pwd field is empty
            setNewPwdError('New Password is required');
            valid = false;
        } else if (newPwd.length < 6) {//Check new pwd length
            setNewPwdError('New Password must be at least 6 characters long');
            valid = false;
        }

        if (!newPwdC) {//Check confirm new pwd field is empty
            setNewPwdCError('Please confirm the new password');
            valid = false;
        } else if (newPwd !== newPwdC) {//Check new pwd fields are same
            setNewPwdCError('Passwords do not match');
            valid = false;
        }

        if (valid == false) return;

        //Change the password
        axios.post("http://localhost:3001/api/employee/changePwd", {
            "oldPwd": oldPwd,
            "newPwd": newPwd,
            "newPwdC": newPwdC,
        }, {
            headers: {
                ...Autheader()
            }
        })
            .then((response) => {
                console.log("PWD CHANGED");
                setOldPwd('');
                setNewPwd('');
                setNewPwdC('');
                toast.success("Password changed");
                //if the code 401: Old pwd incorrect
                //if the code 200; All good
            })
            .catch((error) => {
                toast.success("Wrong Password");
                console.error("Wrong password:", error);
            });
    }

    //Submit Profile changes
    const onSubmit = async (values, actions) => {
        console.log("Submitted");
        axios.post("http://localhost:3001/api/employee/setProfileData", {
            "f_name": values.f_name,
            "l_name": values.l_name,
            "nic": values.nic,
            "email": values.email,
            "tel_number": values.tel_number,
        }, {
            headers: {
                ...Autheader()
            }
        })
            .then((response) => {
                console.log("SAVED");
                toast.success("Saved");//Display saved massage
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
                toast.error(error.response.data.error);
            });
    }

    const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
        initialValues: initialValues,//asign initial values
        validationSchema: employeeFormValidation,//Form validations

        onSubmit,
    });

    return (
        <>

            <ToastContainer />
            {/* Header details */}
            <Box component='h2' sx={{ textAlign: 'center' }}>Emp ID: {empData.emp_id}</Box>
            <Box component='h3' sx={{ textAlign: 'center' }}>Position: {empData.position}</Box>

            <Box component='div' sx={{ mt: '2rem' }}>
                {/* My details Form */}
                <div className="relative">
                    <Formik>
                        <Form onSubmit={handleSubmit}>
                            <Box component="div"
                                sx={{ display: 'flex', justifyContent: 'space-around', mt: '1rem' }}>
                                <Box component="div" style={{ border: '1px solid gray', padding: '1rem' }}>
                                    <Box component="h3" sx={{ mb: 2, textAlign: 'center' }}>My details</Box>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {/* First name input field */}
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
                                                    {/* Last name input field */}
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
                                                    {/* NIC input field */}
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
                                                    {/* telephone number input field */}
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
                                                    {/* Email input field */}
                                                    <TextField label="Email" size="small" type='text' name='email' margin="email"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.email && Boolean(errors.email)}
                                                        helperText={touched.email && errors.email}
                                                        initialValues={values.email}

                                                        sx={{ m: '1rem 0' }}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <Box component="div" sx={{}}>
                                        {/* Save button */}
                                        <Button variant="contained"
                                            type="submit"
                                            sx={{ backgroundColor: '#68DD62', ml: '1rem' }}>
                                            Save
                                        </Button>

                                    </Box>
                                </Box>


                                {/* Change Password */}
                                <Box component="div" style={{ border: '1px solid gray', padding: '1rem', width: '250px' }}>
                                    <Box component="h3" sx={{ mb: 2, textAlign: 'center' }}>Change Password</Box>
                                    <table>
                                        <tr>
                                            <td>
                                                {/* Old password field */}
                                                <TextField label="Old Password" size="small" type='password' name='oldPwd'
                                                    value={oldPwd}
                                                    onChange={(e) => {
                                                        setOldPwdError('');
                                                        setOldPwd(e.target.value);
                                                    }}
                                                    error={!!oldPwdError}
                                                    helperText={oldPwdError}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {/* New password field */}
                                                <TextField label="New Password" size="small" type='password' name='newPwd' margin="normal"
                                                    value={newPwd}
                                                    onChange={(e) => { setNewPwdCError(''); setNewPwd(e.target.value); }}
                                                    sx={{ mb: 2 }}
                                                    error={!!newPwdCError}
                                                    helperText={newPwdCError}

                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {/* Confirm new password */}
                                                <TextField label="Confirm New Password" size="small" type='password' name='tp'
                                                    value={newPwdC}
                                                    onChange={(e) => {
                                                        setNewPwdCError('');
                                                        setNewPwdC(e.target.value);

                                                    }}
                                                    error={!!newPwdCError}
                                                    helperText={newPwdCError}
                                                />
                                            </td>
                                        </tr>
                                    </table>
                                    {/* Change password button */}
                                    <Button variant="contained" onClick={changePWD}
                                        sx={{ backgroundColor: '#68DD62', ml: '40px', mt: '1rem' }}>
                                        Change password
                                    </Button>
                                </Box>
                            </Box>
                        </Form>
                    </Formik>
                </div>
            </Box>
        </>
    );
};

