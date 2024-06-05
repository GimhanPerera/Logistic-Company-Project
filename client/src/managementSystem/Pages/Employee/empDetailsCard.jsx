import { Box, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmpDetailsCard = ({ employee }) => {

  const navigate = useNavigate();

  const toView = () => {
    navigate('./view', { state: { empData: employee } });
  };


  return (
    <Paper
      sx={{
        width: '50%',
        height: '7rem',
        border: '1px solid',
        marginTop: '0.75rem',
        padding: '0.5rem',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
      <div>
        <div className="">Employee ID: {employee.emp_id}</div>
        <div className="">Name: {employee.f_name} {employee.l_name}</div>
        <div className="">Tel number: 0{employee.tel_number}</div>
        {employee.status == 'active' ? <div>Status: {employee.status}</div> : <div style={{color:'red'}}>Status: {employee.status}</div>}
      </div>
      <Box component="div"
        sx={{
          color: '#3B82F6', // Blue-500 in Tailwind is equivalent to this color
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          cursor: 'pointer'
        }}
      >
      </Box>
      <div>
        <Box component="div"
          sx={{
            color: '#3b82f6',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: '100%',
            textDecoration: 'underline'
          }}
        >
          {/* <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }}>New order</Button> */}
          <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }} onClick={toView}>View/Edit</Button>
          {/* <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }}>Delete</Button> */}
          {/* <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }}>History</Button> */}
        </Box>
      </div>
    </Paper>
  )
}

export default EmpDetailsCard
