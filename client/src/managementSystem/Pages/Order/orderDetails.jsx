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
    <div>
        <SearchBar/>
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