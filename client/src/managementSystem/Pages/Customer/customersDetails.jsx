import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import CustomerDetailsCard from "./CustomerDetailsCard";


const CustomersDetails = () => {
  
  const [listOfCustomers, setListOfCustomers] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/api/customers").then((response)=>{
          setListOfCustomers(response.data);
        })
    }, [])

  return (
    <div>
        <SearchBar/>
        {/* key kiyanne index in the array */}
        {listOfCustomers.map((customer, index) => (
        <div key={index} className="post flex flex-col items-center">
          <CustomerDetailsCard customer={customer} />
        </div>
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
