import { Box, Button, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
    const location = useLocation();
    const { orderId, payments } = location.state || {};
    //const { id } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null); // Set initial state to null
    const [loading, setLoading] = useState(true); // Loading state
    const [discount, setDiscount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const componentRef = useRef();
    const [addImage, setaddImage] = useState(true);
    const [image, setImage] = useState(null);
    const [paymentList, setPaymentList] = useState(null);
    const [paymentMethod, setPaymentMethod] = React.useState('Cash');
    const [paymentValue, setPaymentValue] = React.useState(0.00);

    const handlePayMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };
    const handleAmountChange = (event) => {
        setPaymentValue(event.target.value);
    };

    const getCurrentSriLankanDateTime = () => {
        const currentDate = new Date();
        //const time = currentDate.toLocaleTimeString();//This give the GMT time. Need to add 5.30hours to convert to Sri Lankan time
        currentDate.setHours(currentDate.getHours() + 5);
        currentDate.setMinutes(currentDate.getMinutes() + 30);
        const updatedTime = currentDate.toLocaleTimeString(); //Sri lankan time
    
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
    
        const formattedDate = `${year}-${month}-${day} ${updatedTime}`;
        return formattedDate;
    };

    const addPayment = () => {

        const newPayment = {
            order_id: orderId,
            payment_method: paymentMethod,
            payment: paymentValue,
            date_time: getCurrentSriLankanDateTime()
        };

        axios.post('http://localhost:3001/api/invoice/addPayment', newPayment)
            .then((response) => {
                setPaymentList([...paymentList, response.data]);
                setPaymentValue(0.00); // Reset payment value
                setPaymentMethod('Cash'); // Reset payment method to default
            })
            .catch((error) => {
                console.error("Error adding payment:", error);
            });
    }
    const toBack = () => {
        navigate('./..', { state: { id: orderId } });
    }
    const toPayment = () => {
        //navigate('./payments', { state: { orderId: order.order_id, payments: orderDetails.payment} });
    }

    useEffect(() => {
        //console.log("ID: ", order_id);
        setPaymentList(payments);
        setLoading(false)

    }, [payments]);


    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while fetching data
    }

    const tableCell = {
        border: '1px solid #dddddd',
        padding: '8px'
    }
    const removePayment = (paymentId) => {
        axios.delete(`http://localhost:3001/api/invoice/removePayment/${paymentId}`)
            .then((response) => {
                setPaymentList(paymentList.filter(payment => payment.payment_id !== paymentId));
            })
            .catch((error) => {
                console.error("Error removing payment:", error);
            });
    };



    const totalPaymentsMade = 0;//orderDetails.payment.reduce((sum, payment) => sum + parseFloat(payment.payment) || 0, 0);
    const amountDue = 0;//orderDetails.invoice.total - totalPaymentsMade;

    return (
        <>
            <div>
                <Button onClick={toBack}>
                    Back
                </Button>
            </div>

            <Box component="p" sx={{ fontSize: '1.2rem' }}>Amount</Box>
            <TextField size='small' variant="outlined" value={paymentValue} onChange={handleAmountChange} type='number' />
            <Box component="h3" sx={{ mb: 2, width: '150px' }}>
                <FormControl fullWidth>
                    <Select
                        size='small'
                        value={paymentMethod}
                        onChange={handlePayMethodChange}
                    >
                        <MenuItem value={'Cash'}>Cash</MenuItem>
                        <MenuItem value={'Bank transfer'}>Bank transfer</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Button onClick={addPayment} variant="contained">
                Add
            </Button>

            {/*Payments*/}
            <Box component="h3" sx={{}}>Total Payments: {paymentList.reduce((sum, payment) => sum + parseFloat(payment.payment) || 0, 0)}</Box>
            <Box component="h3" sx={{ mb: 2 }}>Need to pay: {amountDue.toFixed(2)}</Box>
            <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={tableCell}>Payment ID</th>
                        <th style={tableCell}>Payment method</th>
                        <th style={tableCell}>Payment</th>
                        <th style={tableCell}>Date time</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentList.map((payment, index) => (
                        <tr>
                            <td style={tableCell}>{payment.payment_id}</td>
                            <td style={tableCell}>{payment.payment_method}</td>
                            <td style={tableCell}>{payment.payment}</td>
                            <td style={tableCell}>{payment.date_time}</td>
                            <td><Button variant="outlined" color="secondary" onClick={() => removePayment(payment.payment_id)}>
                    Remove
                </Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Payment;
