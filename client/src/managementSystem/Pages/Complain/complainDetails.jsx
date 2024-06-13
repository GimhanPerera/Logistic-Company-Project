import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import SendSmsModal from '../../../Modals/sendSmsModal';
import NoDataComponent from '../../../components/NoData';
import SearchBar from "../../../components/SearchBar";
import ComplainDetailsCard from './complainsCard';

const ComplainDetails = () => {

    const [listOfComplains, setListOfComplains] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setModalIsOpen] = useState(false); //Status of Modal
    const [smsDetails, setSmsDetails] = useState(null);
    const [reloadDetails, setReloadDetails] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    let filters = ["pending", "reviewed"];

    useEffect(() => {
        axios.get("http://localhost:3001/api/complain").then((response) => {
            setListOfComplains(response.data);
            setFilteredItems(response.data);
            setSelectedFilters([]);
        })
    }, [reloadDetails]);

    //-----Filters--------------------------------------------------------
    useEffect(() => {
        filterItems();
    }, [selectedFilters]);

    const filterItems = () => {
        if (selectedFilters.length > 0) {
            let tempItems = selectedFilters.map((selectedCategory) => {
                let temp = listOfComplains.filter((item) => item.status === selectedCategory);
                return temp;
            });
            setFilteredItems(tempItems.flat());
        } else {
            setFilteredItems([...listOfComplains]);
        }
    }


    const handleFilterButtonClick = (selectedCategory) => {
        if (selectedFilters.includes(selectedCategory)) {
            let filters = selectedFilters.filter((el) => el !== selectedCategory);
            setSelectedFilters(filters);
        } else {
            setSelectedFilters([...selectedFilters, selectedCategory]);
        }
    };
    //---------------------------------------------------------------------------------
    if (listOfComplains.length == 0) return (
        <>
            <SearchBar label='Search by order id' search={search} setSearch={setSearch} />
            <NoDataComponent message="No Data" />
        </>)
    else
        return (
            <div>
                <SearchBar label={"Search by order id"} search={search} setSearch={setSearch} />

                {/* Filters */}
                <Box component="div" sx={{ border: '1px solid black', margin: '0.7rem auto', padding: '0.3rem', display: 'flex', flexDirection: 'row', width: '800px' }}>
                    <Box component='h3' sx={{ marginRight: '1rem' }}>Filter by status:</Box>
                    <Box component="div" sx={{}}>
                        {filters.map((category, idx) => (
                            <Button size='small'
                                onClick={() => handleFilterButtonClick(category)}
                                style={selectedFilters?.includes(category) ? { backgroundColor: '#3a67fb', color: '#FFFFFF', height: '1.4rem', marginLeft: '0.3rem' } : { height: '1.4rem', marginLeft: '0.3rem' }}
                                key={`filters-${idx}`}
                            >
                                {category}
                            </Button>
                        ))}
                    </Box>
                </Box>


                {/* key kiyanne index in the array */}
                {filteredItems.filter((item) => {
                    return search.toLowerCase() === ''
                        ? item
                        : item.order_id.toLowerCase().includes(search);
                }).map((complain, index) => (
                    <Box component="div" key={index}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <ComplainDetailsCard complain={complain} setSmsDetails={setSmsDetails} onOpen={() => setModalIsOpen(true)} reloadDetails={reloadDetails} setReloadDetails={setReloadDetails} />
                    </Box>
                ))}

                <SendSmsModal open={isModalOpen} onClose={() => setModalIsOpen(false)} smsDetails={smsDetails} reloadSms={setReloadDetails} />
            </div>
        )
}

export default ComplainDetails
