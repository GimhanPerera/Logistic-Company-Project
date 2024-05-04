import axios from 'axios';
import React, { useState } from 'react';
import './complainModal.css';
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

        axios.post("http://localhost:3001/api/complain", {
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
            <div id='card'>
                <h4 id='title'>Open a complain</h4><hr />
                <div>
                    <p className='ord_number'>Order number: {ordId}</p>
                    <p>Complain</p>
                    <textarea
                        id="w3review"
                        name="w3review"
                        rows="4" cols="50"
                        value={complainText} // Bind value to state variable
                        onChange={(e) => setComplainText(e.target.value)}
                    >
                    </textarea>
                    <p className='text'>(We will respond to your complain within 24hours from a telephone call or a SMS. Stay turn)</p>
                    <button onClick={submitComplain} id='submit_btn'>Submit</button><br />
                    <button onClick={clickCloseBtn} id='cancel_btn'>Cancel</button>
                </div>

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
