import { Box } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import nodataImg from './../../../assets/nodata.png';
import OrderRequestCard from './orderRequestCard';
const OrderRequest = () => {

  const [listOfpriceQ, setlistOfpriceQ] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/api/priceQuotationRouter").then((response) => {
      setlistOfpriceQ(response.data);
      console.log(response.data)
    })
  }, [])
  if (listOfpriceQ.length == 0) return (
    <>
    <SearchBar />
      <Box component="div" sx={{width:'100%'}}>
        <img src={nodataImg} alt='empty image' style={{ margin:'auto', width: '26rem', marginLeft:'300px'}} />
        <Box component="p" sx={{width:'100px', margin:'auto', fontSize:'20px', fontWeight:'600'}}>No Data</Box>
      </Box>
    </>)
  else
    return (
      <div>
        <SearchBar />
        {listOfpriceQ.map((priceQ, index) => (
          <Box component="div" key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <OrderRequestCard priceQ={priceQ} />
          </Box>
        ))}
      </div>
    )

}

export default OrderRequest
