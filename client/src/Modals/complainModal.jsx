import axios from 'axios';
import React, { useState } from 'react';

export default function ComplainModel({ open, onClose, ordId }) {
    const [resp, setResp] = useState();
    const [complainText, setComplainText] = useState('');
    const token = localStorage.getItem('token');

    const handleClose = (e) => {
        if (e.target.id === 'container') {
            setComplainText(''); // Clear the text box
            onClose();
        }
    }
    const clickCloseBtn = () => {
        setComplainText(''); // Clear the text box
        onClose();
    }

    const submitComplain = () => {
        
        //VALIDATION SHOULD DONE HERE

        axios.post("http://localhost:3001/complain", {
            "order_id": ordId,
            "complain": complainText
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setResp(response.data);
            setComplainText(''); // Clear the text box
            onClose();
        }).catch((error) => {
            console.error('Error submitting complain:', error);
        });
    }

    if (!open) return null;
    return (
        <>
            {/*Card*/}
                <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 z-50'>
                    <h4 className='text-3xl font-bold'>Open a complain</h4><hr className='h-1 mt-2 mb-2'/>
                    <div>
                        <p className='font-semibold'>Order number: {ordId}</p>
                        <p>Complain</p>
                        <textarea
                            id="w3review"
                            name="w3review"
                            rows="4" cols="50"
                            className='border border-solid border-black w-96 p-1'
                            value={complainText} // Bind value to state variable
                            onChange={(e) => setComplainText(e.target.value)}
                        >
                        </textarea>
                        <p className='w-96 leading-5'>(We will respond to your complain within 24hours from a telephone call or a SMS. Stay turn)</p>
                        <button onClick={submitComplain} className='mt-2 bg-[#1E90FF] text-white w-full p-2 rounded-3xl border-solid border-1 border-[#1E90FF]'>Submit</button><br />
                        <button onClick={clickCloseBtn} className='mt-2 bg-[#feffff] text-[#1E90FF] w-full p-2 rounded-lg'>Cancel</button>
                    </div>

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
