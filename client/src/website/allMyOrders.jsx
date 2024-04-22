import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from "./orderCard";

export const AllMyOrders = () => {
  const navigate = useNavigate();
  const toBack = () => {
    navigate('../');
}
  const [listOfOrders, setListOfOrders] = useState([]);
    useEffect(() => {
      const token = localStorage.getItem('token');
        axios.get("http://localhost:3001/api/order/myTrackingDetails",{
          headers: {
              Authorization: `Bearer ${token}`
          }
      }).then((response)=>{
            setListOfOrders(response.data);
        })
    }, [])

  return (
    <div>
        <button onClick={toBack}>Log out</button>
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
