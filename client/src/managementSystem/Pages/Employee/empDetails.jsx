import { Box, Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/SearchBar";
import EmpDetailsCard from './empDetailsCard';

const EmpDetails = () => {
    const navigate = useNavigate();
    const [listOfEmployee, setListOfEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const toNewEmployee = () => {
        const employee = {
            "emp_id": '',
            "f_name": '',
            "l_name": '',
            "nic": '',
            "email": '',
            "tel_number": '',
            "status": 'active',
            "position": 'EMP',
        }
        navigate('./view', { state: { empData: employee } });
      }

    useEffect(() => {
        axios.get("http://localhost:3001/api/employee").then((response) => {
            setListOfEmployees(response.data);
        })
    }, []);

    return (
        <div>
            <SearchBar label={"Search by customer id"} search={search} setSearch={setSearch} />
            <Button variant="contained"
        sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }}
        onClick={toNewEmployee}>
        New Employee
      </Button>
            {/* key kiyanne index in the array */}
            {listOfEmployee.filter((item) => {
                return search.toLowerCase() === ''
                    ? item
                    : item.emp_id.toLowerCase().includes(search.toLowerCase());
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
