import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import CourierDetailsCard from "./CourierDetailsCard";


const CourierDetails = () => {
  
  const [listOfCourier, setListOfCourier] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/courier").then((response)=>{
          setListOfCourier(response.data);
        })
    }, [])

  return (
    <div>
        <SearchBar/>
        {/* key kiyanne index in the array */}
        {listOfCourier.map((courier, index) => (
        <div key={index} className="post flex flex-col items-center">
            <CourierDetailsCard courier={courier} />
        </div>
        ))}
    </div>
  )

}

export default CourierDetails
