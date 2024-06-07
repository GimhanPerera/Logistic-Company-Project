import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/SearchBar";
import OrderDetailsCard from "./orderDetailsCard";

const OrderDetails = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  let filters = ["Just opened","Waiting","In Warehouse","Ship/airfreight","onhand","Ready","FINISH"];
  const [search, setSearch] = useState('');

  const navigate = useNavigate();
  const [listOfOrderDetails, setListOfOrder] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/api/order").then((response) => {
      setListOfOrder(response.data);
      setFilteredItems(response.data);
    })
  }, []);

  useEffect(() => {
    filterItems();
    
  }, [selectedFilters]);

  const filterItems = () => {
    if(selectedFilters.length > 0){
      let tempItems = selectedFilters.map((selectedCategory) => {
        let temp = listOfOrderDetails.filter((item) => item.status === selectedCategory);
        return temp;
      });
      setFilteredItems(tempItems.flat());
    }else{
      setFilteredItems([...listOfOrderDetails]);
    }
  }
  const removeOrderFromList = (cid) => {
    setListOfOrder(prevList => prevList.filter(order => order.order_id !== cid));
};

  const toNewOrder = () => {
    navigate('../neworder');
  }
  const handleFilterButtonClick = (selectedCategory) => {
    if(selectedFilters.includes(selectedCategory)){
      let filters = selectedFilters.filter((el) => el !== selectedCategory);
      setSelectedFilters(filters);
    }else{
      setSelectedFilters([...selectedFilters, selectedCategory]);
    }
  };

  return (
    <div>
      <SearchBar label='Search by order id' search={search} setSearch={setSearch}/>
      <Button variant="contained"
        sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }}
        onClick={toNewOrder}>
        New Order
      </Button>
      {/* key kiyanne index in the array */}

      <Box component="div" sx={{ border:'1px solid black',margin:'0.7rem auto', padding:'0.3rem', display:'flex', flexDirection:'row', width:'800px' }}>
        <Box component='h3' sx={{marginRight:'1rem'}}>Filter by status:</Box>
      <Box component="div" sx={{ }}>
        {filters.map((category, idx) => (
          <Button size='small'
          onClick={() => handleFilterButtonClick(category)}
          style={selectedFilters?.includes(category) ? {backgroundColor: '#3a67fb', color: '#FFFFFF', height:'1.4rem' ,marginLeft:'0.3rem'}:{height:'1.4rem',marginLeft:'0.3rem'}}
          key={`filters-${idx}`}
          >
            {category}
          </Button>
        ))}
      </Box>
      </Box>
      
      <div>
      {filteredItems.filter((item) => {
          return search.toLowerCase() === ''
          ? item
          : item.order_id.toLowerCase().includes(search);
        }).map((order, index) => (
        <Box component="div" key={`items-${index}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <OrderDetailsCard order={order} removeOrderFromList={removeOrderFromList}/>
        </Box>
      ))}
      <div style={{ marginBottom:'1rem' }}></div>
      </div>
    </div>
  )
}

export default OrderDetails