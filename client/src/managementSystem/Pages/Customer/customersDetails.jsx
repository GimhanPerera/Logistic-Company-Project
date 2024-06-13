import { Box } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import OrderIDsModal from '../../../Modals/orderIDsModal';
import SearchBar from "../../../components/SearchBar";
import { ActiveIDProvider } from './ActiveIDContext';
import CustomerDetailsCard from "./CustomerDetailsCard";

const CustomersDetails = () => {
  const [isComplainOpen, setComplainIsOpen] = useState(false);
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
    <ActiveIDProvider>
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
          <CustomerDetailsCard customer={customer} isOpen={() => setComplainIsOpen(true)}/>
        </Box>
      ))}
      <div style={{ marginBottom:'1rem' }}></div>
      <OrderIDsModal open={isComplainOpen} onClose={() => setComplainIsOpen(false)}>
      </OrderIDsModal>
    </div>
    </ActiveIDProvider>
  )
}

export default CustomersDetails
