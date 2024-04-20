import axios from 'axios';
import React, { useState } from 'react';

export default function FeedbackModel({ open, onClose, ordId }) {
    const [resp, setResp] = useState();
    const [feedbackText, setFeedbackText] = useState('');
    const token = localStorage.getItem('token');
    const [rateValue, setRateValue] = useState(4);
    const [star1Color, setStar1Color] = useState('text-gray-300');
    const [star2Color, setStar2Color] = useState('text-gray-300');
    const [star3Color, setStar3Color] = useState('text-gray-300');
    const [star4Color, setStar4Color] = useState('text-gray-300');
    const [star5Color, setStar5Color] = useState('text-gray-300');
    const normalStarDesign = ' w-7 h-7 ms-1 cursor-pointer';
    const handleClose = (e) => {
        if (e.target.id === 'container') {
            clickCloseBtn();
        }
    }
    const clickCloseBtn = () => {
        setStar1Color('text-gray-300');
        setStar2Color('text-gray-300');
        setStar3Color('text-gray-300');
        setStar4Color('text-gray-300');
        setStar5Color('text-gray-300');
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
            newStarColors[star] = star <= starId ? 'text-yellow-300' : 'text-gray-300';
        });
    
        // Update state for star colors
        setStar1Color(newStarColors['star1']);
        setStar2Color(newStarColors['star2']);
        setStar3Color(newStarColors['star3']);
        setStar4Color(newStarColors['star4']);
        setStar5Color(newStarColors['star5']);
    };
    
    const submitComplain = () => {
        console.log("T1");
        // VALIDATION SHOULD BE DONE HERE
    
        axios.post("http://localhost:3001/feedback", {
            "order_id": ordId,
            "rating": rateValue,
            "feedback": feedbackText
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setResp(response.data);
            console.log("T2");
            clickCloseBtn();
        }).catch((error) => {
            console.error('Error submitting complain:', error);
            console.log("T3");
        });
    };
    

    if (!open) return null;
    return (
        <>
            <div>
                <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 z-50'>
                    <h4 className='text-3xl font-bold'>Feedback</h4><hr  className='h-1 mt-2 mb-2'/>
                    <div>
                        <p className='font-semibold'>Order number: {ordId}</p>
                        <div className=''>
                        <p className='mt-1'>Rate: </p>
                        

                        <div className="flex items-center mb-2">
                            <svg onClick={setRate} className={star1Color + normalStarDesign} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path id='star1' d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            <svg onClick={setRate} className={star2Color + normalStarDesign} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path id='star2' d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            <svg onClick={setRate} className={star3Color + normalStarDesign} fill="currentColor" viewBox="0 0 22 20">
                                <path id='star3' d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            <svg onClick={setRate} className={star4Color + normalStarDesign} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path id='star4' d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            <svg onClick={setRate} className={star5Color + normalStarDesign} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path id='star5' d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                        </div>
                        </div>
                     <p>Feedbaack</p>
                        <textarea
                         id="w3review"
                            name="w3review"
                            rows="4" cols="50"
                            className='border border-solid border-black w-96 p-1'
                            value={feedbackText} // Bind value to state variable
                            onChange={(e) => setFeedbackText(e.target.value)}
                        >
                        </textarea>
                        <div>
                        <button onClick={submitComplain} className='mt-2 bg-[#1E90FF] text-white w-full p-2 rounded-3xl border-solid border-1 border-[#1E90FF]'>Submit</button><br />
                        <button onClick={clickCloseBtn} className='mt-2 bg-[#feffff] text-[#1E90FF] w-full p-2 rounded-lg'>Cancel</button>
                        </div>
                    </div>

                </div>

            </div>
            <div
                id='container' onClick={handleClose}
                className='fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 z-40'
            />
        </>
    )
}
