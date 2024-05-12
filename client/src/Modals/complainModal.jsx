import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { complainValidation } from '../validations';
import './complainModal.css';

export default function ComplainModel({ open, onClose, ordId }) {
    const [resp, setResp] = useState();
    const [complainText, setComplainText] = useState('');
    const token = localStorage.getItem('token');

    const handleClose = (e) => {
        if (e.target.id === 'container') {
            values.complain='';
            //actions.setErrors({});
            onClose();
        }
    }
    const clickCloseBtn = () => {
        values.complain='';
        onClose();
    }

    const onSubmit = async (values, actions) => {
        try {
            axios.post("http://localhost:3001/api/complain", {
                "order_id": ordId,
                "complain": values.complain
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                setResp(response.data);
                actions.resetForm(); // Clear the text box
                onClose();
            }).catch((error) => {
                console.error('Error submitting complain:', error);
            });

        } catch (error) {
            toast.error("Invalid email or password");
        }

    }
    const { values, errors, handleBlur, handleChange, handleSubmit, touched } = useFormik({
        initialValues: {
            complain: "",
        },
        validationSchema: complainValidation,
        onSubmit
    });

    if (!open) return null;
    return (
        <>
            {/*Card*/}
            <div id='card'>
                <h4 id='title'>Open a complain</h4><hr />
                <form onSubmit={handleSubmit}>
                    <p className='ord_number'>Order number: {ordId}</p>
                    <p>Complain</p>
                    <textarea
                        id="complain"
                        name="complain"
                        rows="4" cols="50"
                        value={values.complain}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    >
                    </textarea><br/>
                    {errors.complain && touched.complain && <small style={{ color: 'red' }}>{errors.complain}</small>}
                    <p className='text'>(We will respond to your complain within 24hours from a telephone call or a SMS. Stay turn)</p>
                    <button type='submit' id='submit_btn'>Submit</button><br />
                    <button onClick={clickCloseBtn} id='cancel_btn'>Cancel</button>
                </form>

            </div>



            {/*Background*/}
            <div
                id='container' onClick={handleClose}
            />
        </>
    )
}

//NOTE
//textarea and paragragh width make the card width
