import { Box, Button } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const SpecialNoticesCard = ({ notice }) => {

    const [visible, setVisible] = useState(true);
    const navigate = useNavigate();

    const toEditNotices = () => {
        navigate('./addEdit', { state: {notice:notice, isNew:false}});
    }

    const deleteNotice = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const id = notice.notice_id;
                axios.delete(`http://localhost:3001/api/noitces/${id}`)
                    .then((response) => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        setVisible(false);
                    })
                    .catch((error) => {
                        console.error("Error fetching courier details:", error);
                    });
            }
        });
    }
    if(!visible) return null;
    return (
        <Box component="div"
            sx={{
                width: '50%',
                height: '9rem',
                border: '2px solid',
                marginTop: '0.75rem',
                padding: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
            <Box component="div" sx={{position:'relative'}}>
                <Box component="p" sx={{marginBottom:'0.2rem'}}>ID: {notice.notice_id}{notice.isLive ?<span style={{marginBottom:'0.2rem', color:'#03fe21', marginLeft:'1rem'}}>  Live</span>: ''}</Box>
                <Box component="p" sx={{marginBottom:'0.2rem'}}>Title: {notice.title}</Box>
                <Box component="p" sx={{marginBottom:'0.2rem'}}>Description: {notice.description}</Box>
                <Box component="p" sx={{marginBottom:'0.2rem'}}>Expire Date: {notice.expire_date}</Box>
                <Box component="p" sx={{marginBottom:'0.2rem'}}>Created by: {notice.emp_id}</Box>
                
            </Box>
            <Box component="div"
                sx={{
                    color: '#3B82F6', // Blue-500 in Tailwind is equivalent to this color
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                }}
            >
            </Box>
            <Box component="div">
                <Box component="div"
                    sx={{
                        color: '#3b82f6',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        height: '100%',
                        textDecoration: 'underline'
                    }}
                >
                    {/* <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }}>New order</Button> */}
                    <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }} onClick={toEditNotices}>Edit</Button>
                    {/* <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }}>Delete</Button> */}
                    <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }} onClick={deleteNotice}>Delete</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default SpecialNoticesCard
