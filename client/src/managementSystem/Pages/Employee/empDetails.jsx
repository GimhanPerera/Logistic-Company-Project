import { Box } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import SearchBar from "../../../components/SearchBar";
import EmpDetailsCard from './empDetailsCard';

const EmpDetails = () => {

    const [listOfEmployee, setListOfEmployees] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get("http://localhost:3001/api/employee").then((response) => {
            setListOfEmployees(response.data);
        })
    }, []);

    return (
        <div>
            <SearchBar label={"Search by customer id"} search={search} setSearch={setSearch} />
            {/* key kiyanne index in the array */}
            {listOfEmployee.filter((item) => {
                return search.toLowerCase() === ''
                    ? item
                    : item.emp_id.toLowerCase().includes(search);
            }).map((employee, index) => (
                <Box component="div" key={index}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <EmpDetailsCard employee={employee} />
                </Box>
            ))}
        </div>
    )

}

export default EmpDetails
