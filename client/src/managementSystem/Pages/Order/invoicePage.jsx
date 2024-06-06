import PrintIcon from '@mui/icons-material/Print';
import { Box, Button, TextField } from '@mui/material';
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactToPrint from 'react-to-print';
import { ToastContainer, toast } from 'react-toastify';

const InvoicePage = () => {
    const location = useLocation();
    //const { orderId, fullname, status, tel_number, main_tracking_number } = location.state || {};
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null); // Set initial state to null
    const [loading, setLoading] = useState(true); // Loading state
    const [discount, setDiscount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const componentRef = useRef();

    useEffect(() => {
        console.log("GET INVOICE OF ID: ", id)
        axios.get(`http://localhost:3001/api/invoice/${id}`)
            .then((response) => {
                setOrderDetails(response.data);
                console.log(response.data);

                // Calculate initial subTotal and set discount
                let initialSubTotal = 0;
                response.data.packages.forEach((pkg) => {
                    initialSubTotal += parseFloat(pkg.total) || 0;
                });
                setSubTotal(initialSubTotal);
                setDiscount(response.data.invoice.discount || 0);
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch((error) => {
                console.error("Error fetching order details:", error);
                setLoading(false); // Set loading to false if there's an error

            });
    }, [id]);

    const saveDetails = () => {
        console.log("Need to send: ", orderDetails);
        axios.post('http://localhost:3001/api/invoice', orderDetails)
            .then((response) => {
                console.log(response.data);
                toast.success("Invoice saved");
            })
            .catch((error) => {
                console.error("Error fetching order details:", error);
                setLoading(false); // Set loading to false if there's an error

            });
    }

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while fetching data
    }

    if (!orderDetails) {
        return <div>No order details available</div>; // Handle case where no order details are available
    }

    const tableCell = {
        border: '1px solid #dddddd',
        padding: '8px'
    }

    const toBack = () => {
        navigate('./..', { state: { id: id } });
    }


    return (
        <>
            <ToastContainer />
            <div>
                <Button variant="contained"
                    sx={{}}
                    onClick={toBack}>
                    Back
                </Button>
                <Button variant="contained"
                    sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2em', top: '4.7rem' }}
                    onClick={saveDetails}>
                    Save
                </Button>
                {/*Print btn*/}
                <ReactToPrint
                    trigger={() => (
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<PrintIcon />}
                            sx={{ ml: '20px' }}
                        >
                            Print / Download
                        </Button>
                    )}
                    content={() => componentRef.current}
                    fileName="shipping_marks.pdf" // Set the default save name here
                />

                {/* INVOICE */}
                <Box component="div" ref={componentRef} sx={{ width: '1000px', p: '2rem', border: '1px black solid' }}>
                    <Box component="p">Invoice ID: {orderDetails.invoice.invoice_id}</Box>
                    <Box component="p">Order ID: {orderDetails.order.order_id}</Box>
                    <Box component="p">Customer ID: {orderDetails.customer.customer_id}</Box>
                    <Box component="p">Tel. number: {orderDetails.customer.tel_number}</Box>
                    <Box component="p">Address: {orderDetails.customer.address}</Box>
                    <Box component="p">Open date: {orderDetails.order.order_open_date}</Box>
                    <table style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={tableCell}>Shipping Marks</th>
                                <th style={tableCell}>Count</th>
                                <th style={tableCell}>L</th>
                                <th style={tableCell}>H</th>
                                <th style={tableCell}>V.W.</th>
                                <th style={tableCell}>G.W.</th>
                                {orderDetails.price_quo.shipping_method == 'Air cargo' ?
                                    <th style={tableCell}>C.W.</th>
                                    :
                                    <th style={tableCell}>CBM</th>
                                }
                                <th style={tableCell}>Rate</th>
                                <th style={tableCell}>Tax</th>
                                <th style={tableCell}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.packages.map((row, index) => (
                                <tr key={index}>
                                    <td style={tableCell}>{row.shipping_mark}</td>
                                    <td style={tableCell}>{row.collected_count}</td>
                                    <td style={tableCell}>{row.length}</td>
                                    <td style={tableCell}>{row.height}</td>
                                    <td style={tableCell}>{row.volume_metric_weight}</td>
                                    <td style={tableCell}>{row.gross_weight}</td>
                                    <td style={tableCell}>
                                        <TextField
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            value={row.chargable_weight || ''}
                                            onChange={(e) => {
                                                const updatedPackages = [...orderDetails.packages];
                                                updatedPackages[index].chargable_weight = parseFloat(e.target.value) || 0;
                                                updatedPackages[index].total = (updatedPackages[index].chargable_weight * (parseFloat(updatedPackages[index].rate) || 0)) + (parseFloat(updatedPackages[index].tax) || 0); setOrderDetails({
                                                    ...orderDetails,
                                                    packages: updatedPackages
                                                });
                                                let subTotal1 = 0;
                                                orderDetails.packages.forEach((pkg) => {
                                                    subTotal1 += parseFloat(pkg.total) || 0;
                                                });
                                                setSubTotal(subTotal1);

                                                const newTotal = subTotal1 - orderDetails.invoice.discount;

                                                // Update orderDetails state to reflect the new discount and total
                                                setOrderDetails({
                                                    ...orderDetails,
                                                    invoice: {
                                                        ...orderDetails.invoice,
                                                        total: newTotal
                                                    }
                                                });
                                            }}
                                        />
                                    </td>
                                    <td style={tableCell}>
                                        <TextField
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            value={row.rate || ''}
                                            onChange={(e) => {
                                                const updatedPackages = [...orderDetails.packages];
                                                updatedPackages[index].rate = e.target.value;
                                                updatedPackages[index].total = (updatedPackages[index].chargable_weight * (parseFloat(updatedPackages[index].rate) || 0)) + (parseFloat(updatedPackages[index].tax) || 0); setOrderDetails({
                                                    ...orderDetails,
                                                    packages: updatedPackages
                                                });
                                                let subTotal1 = 0;
                                                orderDetails.packages.forEach((pkg) => {
                                                    subTotal1 += parseFloat(pkg.total) || 0;
                                                });
                                                setSubTotal(subTotal1);
                                                const newTotal = subTotal1 - orderDetails.invoice.discount;

                                                // Update orderDetails state to reflect the new discount and total
                                                setOrderDetails({
                                                    ...orderDetails,
                                                    invoice: {
                                                        ...orderDetails.invoice,
                                                        total: newTotal
                                                    }
                                                });
                                            }}
                                        />
                                    </td>
                                    <td style={tableCell}>
                                        <TextField
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            value={row.tax || '0'}
                                            onChange={(e) => {
                                                const updatedPackages = [...orderDetails.packages];
                                                updatedPackages[index].tax = e.target.value;
                                                updatedPackages[index].total = (updatedPackages[index].chargable_weight * (parseFloat(updatedPackages[index].rate) || 0)) + (parseFloat(updatedPackages[index].tax) || 0); setOrderDetails({
                                                    ...orderDetails,
                                                    packages: updatedPackages
                                                });
                                                let subTotal1 = 0;
                                                orderDetails.packages.forEach((pkg) => {
                                                    subTotal1 += parseFloat(pkg.total) || 0;
                                                });
                                                setSubTotal(subTotal1);
                                                const newTotal = subTotal1 - orderDetails.invoice.discount;

                                                // Update orderDetails state to reflect the new discount and total
                                                setOrderDetails({
                                                    ...orderDetails,
                                                    invoice: {
                                                        ...orderDetails.invoice,
                                                        total: newTotal
                                                    }
                                                });
                                            }}
                                        />
                                    </td>
                                    <td style={tableCell}>
                                        <TextField
                                            sx={{ font: 'black' }}
                                            variant="outlined"
                                            size="small"
                                            value={row.total || '0'}
                                            disabled
                                            InputProps={{
                                                style: {
                                                    color: 'red' // Change 'red' to any color you prefer
                                                }
                                            }}
                                            onChange={(e) => {
                                                const updatedPackages = [...orderDetails.packages];
                                                updatedPackages[index].total = e.target.value;
                                                setOrderDetails({
                                                    ...orderDetails,
                                                    packages: updatedPackages
                                                });
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                    <Box component="div" sx={{ display: 'flex', justifyContent: 'flex-end', mt: '0.5rem', mr: '1rem' }}>
                        <table style={{ width: '220px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'left' }}><Box component="h4">Sub Total</Box></td>
                                    <td style={{ textAlign: 'right' }}><Box component="h4">{subTotal}</Box></td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: 'left' }}><Box component="h4">Discount</Box></td>
                                    <td style={{ textAlign: 'right' }}><Box component="h4"><TextField
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        value={discount}
                                        defaultValue={orderDetails.invoice.discount}
                                        sx={{ ml: '2rem' }}
                                        onChange={(e) => {
                                            const newDiscount = parseFloat(e.target.value) || 0;
                                            setDiscount(newDiscount);

                                            // Recalculate total with the new discount
                                            //const subTotal = orderDetails.packages.reduce((acc, pkg) => acc + (pkg.total || 0), 0);
                                            //const totalTax = orderDetails.packages.reduce((acc, pkg) => acc + (parseFloat(pkg.tax) || 0), 0);
                                            const newTotal = subTotal - newDiscount;

                                            // Update orderDetails state to reflect the new discount and total
                                            setOrderDetails({
                                                ...orderDetails,
                                                invoice: {
                                                    ...orderDetails.invoice,
                                                    discount: newDiscount,
                                                    total: newTotal
                                                }
                                            });
                                        }}
                                    />
                                    </Box>
                                    </td>
                                </tr>
                                {/* <tr>
                                    <td style={{ textAlign: 'left' }}><Box component="h4">Total Tax</Box></td>
                                    <td style={{ textAlign: 'right' }}><Box component="h4">000</Box></td>
                                </tr> */}
                                <tr>
                                    <td style={{ textAlign: 'left' }}><Box component="h3">Total</Box></td>
                                    <td style={{ textAlign: 'right' }}><Box component="h3">{orderDetails.invoice.total}</Box></td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>
                </Box>
            </div>
        </>
    )
}

export default InvoicePage;
