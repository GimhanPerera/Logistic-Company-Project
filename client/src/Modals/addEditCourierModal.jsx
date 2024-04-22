import axios from 'axios';
import React, { useState } from 'react';

export default function AddEditCourierModal({ open, onClose, courierID }) {
    const [resp, setResp] = useState();
    const [nameField, setNameField] = useState('');
    const [tpFields, setTpFields] = useState('');
    const token = localStorage.getItem('token');

    const handleClose = (e) => {
        if (e.target.id === 'container') {
            setNameField(''); // Clear the text box
            setTpFields('')
            onClose();
        }
    }
    const clickCloseBtn = () => {
        setNameField(''); // Clear the text box
        setTpFields('')
        onClose();
    }

    const addCourier = () => {
        
        //VALIDATION SHOULD DONE HERE

        axios.post("http://localhost:3001/courier", {
            "name": nameField,
            "tel_number": tpFields
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setResp(response.data);
            setNameField(''); // Clear the text box
            setTpFields('')
            onClose();
        }).catch((error) => {
            console.error('Error submitting complain:', error);
        });
    }

    const editCourier = () => {
        console.log("TP: "+tpFields)
        //VALIDATION SHOULD DONE HERE

        axios.post("http://localhost:3001/api/courier/edit", {
            "courier_id": open,
            "name": nameField,
            "tel_number": tpFields
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setResp(response.data);
            setNameField(''); // Clear the text box
            setTpFields('')
            onClose();
        }).catch((error) => {
            console.error('Error submitting complain:', error);
        });
    }

    
    if (open == 'add')return (
        <>
            {/*Add Card*/}
                <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 z-50'>
                    <h4 className='text-3xl font-bold'>Add a Courier</h4><hr className='h-1 mt-2 mb-2'/>
                    <div>
                        <p>Name: </p><input
                            className='border border-solid border-black w-96 p-1'
                            value={nameField} // Bind value to state variable
                            onChange={(e) => setNameField(e.target.value)}/>
                        <p>Tel number: </p><input
                            className='border border-solid border-black w-96 p-1'
                            value={tpFields} // Bind value to state variable
                            onChange={(e) => setTpFields(e.target.value)}/>
                        <div>
                            <button onClick={addCourier} className='mt-2 bg-[#1E90FF] text-white w-full p-2 rounded-3xl border-solid border-1 border-[#1E90FF]'>Add</button><br />
                            <button onClick={clickCloseBtn} className='mt-2 bg-[#feffff] text-[#1E90FF] w-full p-2 rounded-lg'>Cancel</button>
                        </div>
                    </div>

                </div>

            

            {/*Background*/}
            <div
                id='container' onClick={handleClose}
                className='fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 z-40'
            />
        </>
    )
    else if(open =='false') return null;
    else return (
        <>
            {/*Edit courier Card*/}
                <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 z-50'>
                    <h4 className='text-3xl font-bold'>Edit a Courier</h4><hr className='h-1 mt-2 mb-2'/>
                    <div>
                        <p className='w-96'>Courier ID: {open}</p>
                        <p>Name: </p><input
                            className='border border-solid border-black w-96 p-1'
                            value={nameField} // Bind value to state variable
                            onChange={(e) => setNameField(e.target.value)}/>
                        <p>Tel number: </p><input
                            className='border border-solid border-black w-96 p-1'
                            value={tpFields} // Bind value to state variable
                            onChange={(e) => setTpFields(e.target.value)}/>
                        <div>
                            <button onClick={editCourier} className='mt-2 bg-[#1E90FF] text-white w-full p-2 rounded-3xl border-solid border-1 border-[#1E90FF]'>Edit</button><br />
                            <button onClick={clickCloseBtn} className='mt-2 bg-[#feffff] text-[#1E90FF] w-full p-2 rounded-lg'>Cancel</button>
                        </div>
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
