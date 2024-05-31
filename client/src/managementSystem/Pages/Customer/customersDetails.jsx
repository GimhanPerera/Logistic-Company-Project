import { Box } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import CustomerDetailsCard from "./CustomerDetailsCard";

const CustomersDetails = () => {
  
  const [listOfCustomers, setListOfCustomers] = useState([]);
  const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get("http://localhost:3001/api/customers").then((response)=>{
          setListOfCustomers(response.data);
        })
    }, [])

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
    </div>
  )


      {/* <div className='relative md:w-65'>
        <span className='relative md:absolute inset-y-0 left-0 flex items-center pl-2'>
          <button className='p-1 focus:outline-none text-white md:text-black'><FaSearch/></button>
        </span>
        <input type='text' className='w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block'/>
      </div> */}

}

export default CustomersDetails
