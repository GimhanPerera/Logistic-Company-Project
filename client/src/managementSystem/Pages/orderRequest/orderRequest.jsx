import { Box } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import NoDataComponent from '../../../components/NoData';
import SearchBar from "../../../components/SearchBar";
import OrderRequestCard from './orderRequestCard';
const OrderRequest = () => {

  const [listOfpriceQ, setlistOfpriceQ] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get("http://localhost:3001/api/priceQuotationRouter").then((response) => {
      setlistOfpriceQ(response.data);
      console.log(response.data)
    })
  }, [])
  if (listOfpriceQ.length == 0) return (
    <>
      <SearchBar label='Search by quotation id' search={search} setSearch={setSearch}/>
      <NoDataComponent message="No Data"/>
    </>)
  else
    return (
      <div>
        <SearchBar label='Search by customer id' search={search} setSearch={setSearch}/>
        {listOfpriceQ.filter((item) => {
          return search.toLowerCase() === ''
          ? item
          : item.quotation_id.toLowerCase().includes(search);
        }).map((priceQ, index) => (
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
