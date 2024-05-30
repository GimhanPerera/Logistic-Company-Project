import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from "../../../components/SearchBar";
import nodataImg from './../../../assets/nodata.png';
import SpecialNoticesCard from './specialNoticesCard';

export const SpecialNotices = () => {
    const [listOfNotices, setListOfNotices] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [orderIds, setOrderIds] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("http://localhost:3001/api/noitces")
            .then((response) => {
                setListOfNotices(response.data);
                setLoading(false); // Set loading to false once data is fetched
                //console.log("HELLO")

            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
                setLoading(false); // Set loading to false in case of error
            });
    }, []);

    

    const toNewNotices = () => {
          navigate('./addEdit', { state: {notice:[], isNew:true}});
      }

    if (listOfNotices.length == 0) return (
        <>
            <SearchBar />
            <Button variant="contained"
                sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }}
                onClick={toNewNotices}
            >
                New Notice
            </Button>

            <Box component="div" sx={{ width: '100%' }}>
                <img src={nodataImg} alt='empty image' style={{ margin: 'auto', width: '26rem', marginLeft: '300px' }} />
                <Box component="p" sx={{ width: '100px', margin: 'auto', fontSize: '20px', fontWeight: '600' }}>No Data</Box>
            </Box>
        </>)
    else
        return (
            <div>
                <SearchBar />
                <Button variant="contained"
                sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }}
                onClick={toNewNotices}
            >
                New Notice
            </Button>
                {listOfNotices.map((notice, index) => (
                    <Box component="div" key={index}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <SpecialNoticesCard notice={notice} />
                    </Box>
                ))}
            </div>
        );
};

