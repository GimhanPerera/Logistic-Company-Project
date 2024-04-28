//Formik but not submit
import axios from "axios";
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { addCustomerValidation } from '../validations';


export default function AddCustomerModel({ open, onClose }) {

    const onSubmit = async (values, actions) => { //Submition here
        const customerData = {
            f_name: values.f_name,
            l_name: values.l_name,
            tel_number: values.tel_number,
            address: values.address,
            nic: values.nic
        }
        axios.post("http://localhost:3001/api/customers", { customerData },
            ).then((response) => {
                alert("New customer added")
                onClose();
                clearFields()
            }).catch((error) => {
                console.error('Error submitting complain:', error);
            });
        //values.f_name : value of f_name
        actions.resetForm(); //Reset the form
    }
    const {values,touched, handleBlur,isSubmitting, setErrors, handleChange, handleSubmit, errors} = useFormik({
        initialValues : {
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
        onClose();setErrors({})
        clearFields()
    }

    const addCustomer = (e) => {
        e.preventDefault();

        console.log("It works")
        axios.post("http://localhost:3001/api/customers", { customerData },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                console.log("New customer added")
                onClose();
                clearFields()
            }).catch((error) => {
                console.error('Error submitting complain:', error);
            });
    }

    if (!open) return null;
    return (
        <>
            {/*Card*/}
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 z-50'>
                <h4 className='text-3xl font-bold'>Add Customer</h4><hr className='h-1 mt-2 mb-2' />

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
                                {errors.f_name && touched.f_name ? <small className="text-red-700 pl-1">{errors.f_name}</small> : null}</tr>
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
                                {errors.l_name && touched.l_name ? <small className="text-red-700 pl-1">{errors.l_name}</small> : null}</tr>
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
                                {errors.tel_number && touched.tel_number ? <small className="text-red-700 pl-1">{errors.tel_number}</small> : null}</tr>
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
                                {errors.address && touched.address ? <small className="text-red-700 pl-1">{errors.address}</small> : null}</tr>
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
                            {errors.nic && touched.nic ? <small className="text-red-700 pl-1">{errors.nic}</small> : null}</tr>
                        </table>
                        <button type='submit' className='mt-2 bg-[#1E90FF] text-white w-full p-2 rounded-3xl border-solid border-1 border-[#1E90FF]'>Submit</button><br />
                        <button onClick={clickCloseBtn} className='mt-2 bg-[#feffff] text-[#1E90FF] w-full p-2 rounded-lg'>Cancel</button>
                    </form>

            </div>

            {/*Background*/}
            <div
                id='container' onClick={handleClose}
                className='fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 z-40'
            />
        </>
    )
}

//NOTE
//textarea and paragragh width make the card width
