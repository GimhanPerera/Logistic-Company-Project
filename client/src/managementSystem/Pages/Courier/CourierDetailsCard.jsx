import { Box } from '@mui/material';
import axios from 'axios';
import React from 'react';
import Swal from 'sweetalert2';

const CourierDetailsCard = ({ courier, reload, clickEdit,setCourierDetails,removeCourierFromList }) => {

  const deleteCourier = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#68DD62",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!"
  }).then(async (result) => {
      if (result.isConfirmed) {
          try {
            axios.delete(`http://localhost:3001/api/courier/${courier.courier_id}`)
            .then((response) => {
              //reload;
              removeCourierFromList(courier.courier_id);
              console.log("Not worked")
            })
            .catch((error) => {
              console.error("Error fetching courier details:", error);
            });

              Swal.fire({
                  title: `Deleted`,
                  icon: "success"
              });
              navigate('../order');
          } catch (error) {
              console.error('Error creating order:', error);
          }
      }
  });
    
  }


  const handleEditClick = () => {
    setCourierDetails(courier);
    clickEdit(courier.courier_id);
  }

  // Check if courier is defined before trying to access its properties
  if (!courier) {
    return null; // or handle the case where courier is undefined/null
  }

  return (
    <Box
      component="div"
      sx={{
        width: '50%', // Equivalent to w-2/4
        height: '6rem', // Equivalent to h-24
        border: '2px solid', // Equivalent to border-2
        marginTop: '0.75rem', // Equivalent to mt-3
        padding: '0.5rem', // Equivalent to p-2
        display: 'flex',
        justifyContent: 'space-between' // Equivalent to justify-between
      }}
    >
      <Box component="div">
        <div>Courier ID: {courier.courier_id}</div>
        <div>Name: {courier.name}</div>
        <div>Tel number: 0{courier.tel_number}</div>
      </Box>
      <div>
        <Box
          component="div"
          sx={{
            color: '#3B82F6',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: '100%',
            textDecoration: 'underline'
          }}
        >
          <Box component="p" sx={{cursor:'pointer'}}>History</Box>
          <Box component="p" sx={{cursor:'pointer'}} onClick={handleEditClick}>Edit</Box>
          <Box component="p" sx={{cursor:'pointer'}} onClick={deleteCourier}>Delete</Box>
        </Box>
      </div>
    </Box>
  );
};

export default CourierDetailsCard;
