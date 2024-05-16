import { Box } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import OrderRequestCard from './orderRequestCard';

const OrderRequest = () => {
  
  const [listOfpriceQ, setlistOfpriceQ] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/api/priceQuotationRouter").then((response)=>{
          setlistOfpriceQ(response.data);
        })
    }, [])

  return (
    <div>
        <SearchBar/>
        {listOfpriceQ.map((priceQ, index) => (
        <Box component="div" key={index}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        >
          <OrderRequestCard priceQ={priceQ}/>
        </Box>
      ))}
    </div>
  )

}

export default OrderRequest
