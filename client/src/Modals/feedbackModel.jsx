import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Autheader from "../services/Autheader";
import './feedbackModal.css';

export default function FeedbackModel({ open, onClose, ordId }) {
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackError, setFeedbackError] = useState('');
    const token = localStorage.getItem('token');
    const [rateValue, setRateValue] = useState(4);
    const [star1Color, setStar1Color] = useState({ color: '#FDE68A' });
    const [star2Color, setStar2Color] = useState({ color: '#d1d5db' });
    const [star3Color, setStar3Color] = useState({ color: '#d1d5db' });
    const [star4Color, setStar4Color] = useState({ color: '#d1d5db' });
    const [star5Color, setStar5Color] = useState({ color: '#d1d5db' });

    const handleClose = (e) => {
        if (e.target.id === 'container') {
            clickCloseBtn();
        }
    }

    const clickCloseBtn = () => {
        setStar1Color({ color: '#FDE68A' });
        setStar2Color({ color: '#d1d5db' });
        setStar3Color({ color: '#d1d5db' });
        setStar4Color({ color: '#d1d5db' });
        setStar5Color({ color: '#d1d5db' });
        setFeedbackText(''); // Clear the text box
        onClose();
    }

    const setRate = (e) => {
        const starId = e.target.id;
        const stars = ['star1', 'star2', 'star3', 'star4', 'star5'];
        const starValues = {
            star1: 1,
            star2: 2,
            star3: 3,
            star4: 4,
            star5: 5
        };

        const newRateValue = starValues[starId];
        setRateValue(newRateValue);

        const newStarColors = {};
        stars.forEach(star => {
            newStarColors[star] = star <= starId ? { color: '#FDE68A' } : { color: '#d1d5db' };
        });

        // Update state for star colors
        setStar1Color(newStarColors['star1']);
        setStar2Color(newStarColors['star2']);
        setStar3Color(newStarColors['star3']);
        setStar4Color(newStarColors['star4']);
        setStar5Color(newStarColors['star5']);
    };

    const handleChange = (e) => {
        const { value } = e.target;
        if (value.length >= 200) {
            setFeedbackError('Feedback must be at most 200 characters long');
        } else {
            setFeedbackError('');
        }

        setFeedbackText(value);
    };

    const submitFeedback = async () => {
        // if (!feedbackText) {
        //     setFeedbackError('Please enter your feedback');
        //     return;
        // }
        if (feedbackText.length >= 200) {
            setFeedbackError('Feedback must be at most 200 characters long');
            return;
        }
        try {

            const response = await axios.post("http://localhost:3001/api/feedback", {
                "order_id": ordId,
                "rating": rateValue,
                "feedback": feedbackText
            }, {
                headers: {
                    ...Autheader()
                }
            })
            Swal.fire({
                position: "center",
                icon: "success",
                title: response.data,
                showConfirmButton: false,
                timer: 1500
            });
            onClose();
        } catch (error) {
            console.error('Error submitting complain:', error.response ? error.response.data : error.message);
        }
    };

    if (!open) return null;
    return (
        <>
            <div>
                <div id='card'>
                    {/* Title */}
                    <h4 id='title'>Feedback</h4><hr />
                    <div>
                        {/* Order Id */}
                        <p className='ord_numbe'>Order number: {ordId}</p>
                        <div className=''>
                            <p className='mt-1'>Rate: </p>

                            {/* Feedback star images */}
                            <div className="flex items-center mb-2">
                                <svg onClick={setRate} className='normalStarDesign' style={star1Color} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path id='star1' d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                                <svg onClick={setRate} className='normalStarDesign' style={star2Color} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path id='star2' d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                                <svg onClick={setRate} className='normalStarDesign' style={star3Color} fill="currentColor" viewBox="0 0 22 20">
                                    <path id='star3' d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                                <svg onClick={setRate} className='normalStarDesign' style={star4Color} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path id='star4' d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                                <svg onClick={setRate} className='normalStarDesign' style={star5Color} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path id='star5' d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                            </div>
                        </div>

                        {/* Feedback textarea */}
                        <p>Feedback</p>
                        <textarea
                            rows="4" cols="50"
                            value={feedbackText} // Bind value to state variable
                            onChange={handleChange}
                            maxLength="200"
                        >
                        </textarea>

                        {/* Error massage */}
                        {feedbackError && <div style={{ color: 'red' }}>{feedbackError}</div>}
                        <div>
                            {/* Submit button */}
                            <button onClick={submitFeedback} id='submit_btn'>Submit</button><br />
                            {/* Cancel button */}
                            <button onClick={clickCloseBtn} id='cancel_btn'>Cancel</button>
                        </div>
                    </div>

                </div>

            </div>
            <div
                id='container' onClick={handleClose}
            />
        </>
    )
}
