import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddEditSpecialNoticeModal } from '../../../Modals/addEditSpecialNoticeModal';
import SearchBar from "../../../components/SearchBar";
import nodataImg from './../../../assets/nodata.png';
import SpecialNoticesCard from './specialNoticesCard';

export const SpecialNotices = () => {
    const [listOfNotices, setListOfNotices] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [search, setSearch] = useState('');

    const [reload, setReload] = useState(true);
    //const [liveNoticesCount, setLiveNoticesCount] = useState(0);

    const [isModalOpen, setModalIsOpen] = useState(false); //Status of Modal
    const [noticeDetails, setNoticeDetails] = useState(null);
    const reloadNotices = () => {
        axios.get("http://localhost:3001/api/noitces")
            .then((response) => {
                setListOfNotices(response.data);
            })
            .catch((error) => {
                console.error("Error fetching noitces details:", error);
                setLoading(false);
            });
    };
    const handleEditCourierClick = () => {
        setModalIsOpen(true); // Or setModalIsOpen(true) depending on how you handle the modal state
    };

    const navigate = useNavigate();
    useEffect(() => {
        axios.get("http://localhost:3001/api/noitces")
            .then((response) => {
                setListOfNotices(response.data);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching noitces details:", error);
                setLoading(false); // Set loading to false in case of error
            });
    }, []);

    const toNewNotices = () => {
        axios.get("http://localhost:3001/api/noitces")
            .then((response) => {
                setListOfNotices(response.data);
                setLoading(false); // Set loading to false once data is fetched
                //console.log("HELLO")
                //setLiveNoticesCount(response.data.filter(listOfNotices => listOfNotices.isLive).length)
                const liveNoticesCount = response.data.filter(listOfNotices => listOfNotices.isLive).length;
                if (liveNoticesCount >= 3) {
                    toast.error("Max 3 notices can display in the website");
                    return
                }
                navigate('./addEdit'); //, { state: { notice: [], isNew: true } }
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
                setLoading(false); // Set loading to false in case of error
            });

    }

    if (listOfNotices.length == 0) return (
        <>
            <SearchBar label='Search by id' search={search} setSearch={setSearch} />
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
                <SearchBar label='Search by id' search={search} setSearch={setSearch} />
                <Button variant="contained"
                    sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }}
                    onClick={toNewNotices}
                >
                    New Notice
                </Button>
                {listOfNotices.filter((item) => {
                    return search.toLowerCase() === ''
                        ? item
                        : item.id.toLowerCase().includes(search);
                }).map((notice, index) => (
                    <Box component="div" key={index}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <SpecialNoticesCard notice={notice} reload={reload} clickEdit={handleEditCourierClick} setNoticeDetails={setNoticeDetails} />
                    </Box>
                ))}
                <AddEditSpecialNoticeModal open={isModalOpen} onClose={() => setModalIsOpen(false)} noticeDetails={noticeDetails} reloadNotices={reloadNotices} />
                {/*isModalOpen,setModalIsOpen,courierDetails, reloadCouriers*/}
                <ToastContainer />
            </div>
        );
};

