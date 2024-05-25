import { Box, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useEffect, useState } from 'react';

export default function ScanResultHandler({ open, lastReading, rows,setRows, onClose }) {
    const [collectedCounts, setCollectedCounts] = useState({});
    // const clearFields = (e) => {
    //     setCustomerData({
    //         f_name: '',
    //         l_name: '',
    //         tel_number: 0,
    //         address: '',
    //         nic: ''
    //     })
    // }
    const handleClose = (e) => {
        if (e.target.id === 'container') {
            onClose();
            //setErrors({})
            //clearFields()
        }
    }
    const clickCloseBtn = () => {
        onClose();
        //setErrors({})
        //clearFields()
    }
    const handleSave = () => {
        const updatedRows = rows.map(row => ({
            ...row,
            collectedCount: collectedCounts[row.id] !== undefined ? collectedCounts[row.id] : row.collectedCount,
        }));
        setRows(updatedRows);
        onClose();
    };

    useEffect(() => {
        const initialCollectedCounts = {};
        rows.forEach(row => {
            initialCollectedCounts[row.id] = row.collectedCount;
        });
        setCollectedCounts(initialCollectedCounts);
    }, [rows]);

    const handleCollectedChange = (id, value) => {
        setCollectedCounts(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    useEffect(() => {
        console.log("Rows updated", rows);
    }, [lastReading]);

    if (!open) return null;

    // Filter rows to include only those with shippingMark starting with lastReading
    const filteredRows = rows.filter(row => row.shippingMark.startsWith(lastReading));
    return (
        <>
            {/*Card*/}
            <Box component="div"
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '2rem',
                    zIndex: 50
                }}
            >
                <Box component="h4"
                    sx={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                    }}>{lastReading}</Box>
                <table style={{ border: '1px gray solid' }}>
                    <thead>
                        <tr>
                            <th style={{ paddingRight: '1rem' }}>Related Shipping Marks</th>
                            <th style={{ paddingRight: '1rem' }}>Count</th>
                            <th>Collected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map(row => (
                            <tr key={row.id}>
                                <td><label>{row.shippingMark}</label></td>
                                <td>{row.count}</td>
                                <td>
                                    <FormControl fullWidth>
                                        <Select
                                            value={collectedCounts[row.id] || row.collectedCount}
                                            onChange={(e) => handleCollectedChange(row.id, e.target.value)}
                                        >
                                            {[...Array(row.count + 1).keys()].map(value => (
                                                <MenuItem key={value} value={value}>{value}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 1, border: '1px solid #1E90FF' }} onClick={handleSave}>Submit</Button><br />
                <Button onClick={clickCloseBtn} fullWidth variant="contained" sx={{ mt: 0, mb: 2, border: '1px solid #1E90FF', height: '2.0rem', color: '#1E90FF', backgroundColor: 'white' }}>Cancel</Button>
            </Box>

            {/*Background*/}
            <Box component="div"
                id='container' onClick={handleClose}
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // black with 70% opacity
                    zIndex: 40
                }}
            />
        </>
    )
}