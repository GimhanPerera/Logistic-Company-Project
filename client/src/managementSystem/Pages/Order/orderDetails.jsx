import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import OrderDetailsCard from "./orderDetailsCard";


const OrderDetails = () => {
  
  const [listOfOrderDetails, setListOfOrder] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/order").then((response)=>{
            setListOfOrder(response.data);
        })
    }, [])

  return (
    <div className="relative">
        <SearchBar/>
        <button className="bg-[#68DD62] absolute right-10 top-0 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none">
                New Order
            </button>
        {/* key kiyanne index in the array */}
        {listOfOrderDetails.map((order, index) => (
        <div key={index} className="post flex flex-col items-center">
            <OrderDetailsCard order={order} />
        </div>
        ))}
    </div>
  )

}

export default OrderDetails