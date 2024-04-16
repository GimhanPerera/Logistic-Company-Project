import axios from "axios";
import React, { useEffect, useState } from 'react';
import OrderCard from "./orderCard";


export const AllMyOrders = () => {
  
  const [listOfOrders, setListOfOrders] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/order/myTrackingDetails").then((response)=>{
            setListOfOrders(response.data);
        })
    }, [])

  return (
    <div>
        {/* key kiyanne index in the array */}
        {listOfOrders.map((orders, index) => (
        <div key={index} className="post flex flex-col items-center">
          <OrderCard orders={orders} />
        </div>
      ))}
    </div>
  )

}

//export default AllMyOrders;
