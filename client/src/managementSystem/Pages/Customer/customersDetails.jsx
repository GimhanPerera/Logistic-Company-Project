import { Box } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import CustomerDetailsCard from "./CustomerDetailsCard";

const CustomersDetails = () => {
  
  const [listOfCustomers, setListOfCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const userRole = localStorage.getItem("user");
    if (userRole) {
      const parsedUserRole = JSON.parse(userRole); // Parse the string into an object
      setCurrentUser(parsedUserRole.role);
    }
  }, []);

    useEffect(() => {
        axios.get("http://localhost:3001/api/customers").then((response)=>{
          setListOfCustomers(response.data);
        })
    }, []);

  return (
    <div>
        <SearchBar label={"Search by customer id"} search={search} setSearch={setSearch}/>
        {/* key kiyanne index in the array */}
        {listOfCustomers.filter((item) => {
                    return search.toLowerCase() === ''
                        ? item
                        : item.customer_id.toLowerCase().includes(search);
                }).map((customer, index) => (
        <Box component="div" key={index}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        >
          <CustomerDetailsCard customer={customer} />
        </Box>
      ))}
      <div style={{ marginBottom:'1rem' }}></div>
    </div>
  )
}

export default CustomersDetails
