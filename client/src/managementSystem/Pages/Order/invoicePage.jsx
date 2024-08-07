import { Box, Button, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
    const [isChecked, setIsChecked] = useState(false);
    const [damageFine, setDamageFine] = useState(0);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        if (!event.target.checked) {
            const newTotal = parseFloat(subTotal) - parseFloat(discount);
            setOrderDetails({
                ...orderDetails,
                invoice: {
                    ...orderDetails.invoice,
                    damage_fine: 0.00,
                    total: newTotal
                }
            });
        }
        else {
            const newTotal = parseFloat(subTotal) - parseFloat(discount) - parseFloat(damageFine);
            setOrderDetails({
                ...orderDetails,
                invoice: {
                    ...orderDetails.invoice,
                    damage_fine: damageFine,
                    total: newTotal
                }
            });
        }
    };

    //Get invoice ID
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
                setDamageFine(response.data.invoice.damage_fine || 0);
                setLoading(false); // Set loading to false after data is fetched
                setIsChecked(response.data.invoice.damage_fine == 0.00 ? false : true)
            })
            .catch((error) => {
                console.error("Error fetching order details:", error);
                setLoading(false); // Set loading to false if there's an error

            });
    }, [id]);

    {/* Save invice data */}
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
                    sx={{ ml: '2rem' }}
                    onClick={toBack}>
                    Back
                </Button>
                <Button variant="contained"
                    sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '2rem', top: '5rem' }}
                    onClick={saveDetails}>
                    Save
                </Button>
                {/*Print btn*/}
                {/* <ReactToPrint
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
                /> */}

                <FormControlLabel sx={{ ml: '3rem' }}
                    control={<Checkbox />}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    label="Damage packages"
                />

                {/* INVOICE */}
                <Box component="div" sx={{ mt: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <Box component="div" ref={componentRef} sx={{ width: '1000px', p: '2rem', border: '1px black solid', borderRadius: '10px' }}>
                        <Box component="h3" sx={{ textAlign: 'center' }}>Invoice ID: {orderDetails.invoice.invoice_id}</Box>
                        <Box component="h3" sx={{ textAlign: 'center' }}>Order ID: {orderDetails.order.order_id}</Box>
                        <Box component="h3" sx={{ textAlign: 'center' }}>Customer ID: {orderDetails.customer.customer_id}</Box>
                        <Box component="h3" sx={{ textAlign: 'center' }}>Tel. number: {orderDetails.customer.tel_number}</Box>
                        <Box component="h3" sx={{ textAlign: 'center' }}>Address: {orderDetails.customer.address}</Box>
                        <Box component="h3" sx={{ mb: '1rem', textAlign: 'center' }}>Open date: {orderDetails.order.order_open_date}</Box>
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
                                                    const inputValue = parseFloat(e.target.value) || 0;
                                                    if (inputValue >= 0) { // Check if input is positive or zero
                                                        const updatedPackages = [...orderDetails.packages];
                                                        updatedPackages[index].chargable_weight = inputValue;
                                                        updatedPackages[index].total = (inputValue * (parseFloat(updatedPackages[index].rate) || 0)) + (parseFloat(updatedPackages[index].tax) || 0);
                                                        setOrderDetails({
                                                            ...orderDetails,
                                                            packages: updatedPackages
                                                        });
                                                        let subTotal1 = 0;
                                                        updatedPackages.forEach((pkg) => {
                                                            subTotal1 += parseFloat(pkg.total) || 0;
                                                        });
                                                        setSubTotal(parseFloat(subTotal1.toFixed(2))); // Ensure subTotal has 2 decimal points

                                                        const newTotal = parseFloat((subTotal1 - orderDetails.invoice.discount).toFixed(2)); // Ensure newTotal has 2 decimal points

                                                        // Update orderDetails state to reflect the new discount and total
                                                        setOrderDetails({
                                                            ...orderDetails,
                                                            invoice: {
                                                                ...orderDetails.invoice,
                                                                total: newTotal
                                                            }
                                                        });
                                                    }
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
                                                    const inputValue = parseFloat(e.target.value) || 0;
                                                    if (inputValue >= 0) { // Check if input is positive or zero
                                                        const updatedPackages = [...orderDetails.packages];
                                                        updatedPackages[index].rate = inputValue;
                                                        updatedPackages[index].total = (updatedPackages[index].chargable_weight * inputValue) + (parseFloat(updatedPackages[index].tax) || 0);
                                                        setOrderDetails({
                                                            ...orderDetails,
                                                            packages: updatedPackages
                                                        });
                                                        let subTotal1 = 0;
                                                        updatedPackages.forEach((pkg) => {
                                                            subTotal1 += parseFloat(pkg.total) || 0;
                                                        });
                                                        subTotal1 = parseFloat(subTotal1.toFixed(2)); // Ensure subTotal has 2 decimal points
                                                        setSubTotal(subTotal1);
                                                        const newTotal = parseFloat((subTotal1 - orderDetails.invoice.discount).toFixed(2)); // Ensure newTotal has 2 decimal points
                                                        setOrderDetails({
                                                            ...orderDetails,
                                                            invoice: {
                                                                ...orderDetails.invoice,
                                                                total: newTotal
                                                            }
                                                        });
                                                    }
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
                                                    const inputValue = parseFloat(e.target.value) || 0;
                                                    if (inputValue >= 0) { // Check if input is positive or zero
                                                        const updatedPackages = [...orderDetails.packages];
                                                        updatedPackages[index].tax = inputValue;
                                                        updatedPackages[index].total = (updatedPackages[index].chargable_weight * (parseFloat(updatedPackages[index].rate) || 0)) + inputValue;
                                                        setOrderDetails({
                                                            ...orderDetails,
                                                            packages: updatedPackages
                                                        });
                                                        let subTotal1 = 0;
                                                        updatedPackages.forEach((pkg) => {
                                                            subTotal1 += parseFloat(pkg.total) || 0;
                                                        });
                                                        subTotal1 = parseFloat(subTotal1.toFixed(2)); // Ensure subTotal1 has only 2 decimal points
                                                        setSubTotal(subTotal1);
                                                        const newTotal = subTotal1 - (orderDetails.invoice.discount || 0);

                                                        // Update orderDetails state to reflect the new discount and total
                                                        setOrderDetails({
                                                            ...orderDetails,
                                                            invoice: {
                                                                ...orderDetails.invoice,
                                                                total: parseFloat(newTotal.toFixed(2)) // Ensure total has only 2 decimal points
                                                            }
                                                        });
                                                    }
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
                                        <td style={{ textAlign: 'right' }}><Box component="h4">
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={discount}
                                                defaultValue={orderDetails.invoice.discount}
                                                sx={{ ml: '2rem' }}
                                                onChange={(e) => {
                                                    const newDiscount = parseFloat(e.target.value) || 0;
                                                    if (newDiscount >= 0) { // Ensure the discount is positive or zero
                                                        setDiscount(newDiscount);

                                                        // Recalculate total with the new discount
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
                                                    }
                                                }}
                                            />

                                        </Box>
                                        </td>
                                    </tr>
                                    {isChecked ?
                                        <tr>
                                            <td style={{ textAlign: 'left' }}><Box component="h4">Damage Fine</Box></td>
                                            <td style={{ textAlign: 'right' }}><Box component="h4"><TextField
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={damageFine}
                                                defaultValue={orderDetails.invoice.damage_fine}
                                                sx={{ ml: '2rem' }}
                                                onChange={(e) => {
                                                    const newFine = parseFloat(e.target.value) || 0;
                                                    if (newFine >= 0) {
                                                        setDamageFine(newFine);

                                                        // Recalculate total with the new fine
                                                        const newTotal = subTotal - newFine;

                                                        // Update orderDetails state to reflect the new discount and total
                                                        setOrderDetails({
                                                            ...orderDetails,
                                                            invoice: {
                                                                ...orderDetails.invoice,
                                                                damage_fine: newFine,
                                                                total: newTotal
                                                            }
                                                        });
                                                    }

                                                }}
                                            />
                                            </Box>
                                            </td>
                                        </tr>
                                        : ''}
                                    <tr>
                                        <td style={{ textAlign: 'left' }}><Box component="h3">Total</Box></td>
                                        <td style={{ textAlign: 'right' }}><Box component="h3">{orderDetails.invoice.total}</Box></td>
                                    </tr>
                                </tbody>
                            </table>
                        </Box>
                    </Box>
                </Box>
            </div>
        </>
    )
}

export default InvoicePage;
