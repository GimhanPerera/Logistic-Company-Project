import { Box, Button } from '@mui/material';
import axios from "axios";
import FileSaver from 'file-saver';
import FileDownload from "js-file-download";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const ViewOrder = () => {
    const location = useLocation();
    const { id } = location.state || {};
    //const { id } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null); // Set initial state to null
    const [loading, setLoading] = useState(true); // Loading state
    const [discount, setDiscount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const componentRef = useRef();
    const [addImage, setaddImage] = useState(true);
    const [image, setImage] = useState(null);
    const [printables, setPrintables] = useState([]);

    const toggleAddImage = () => {
        setaddImage(addImage => !addImage);
    };

    const toInvoice = () => {
        navigate(`./${id}`);
    }

    const toBack = () => {
        navigate('./..');
    }

    const toShippingMarks = () => {
        let SMdetails = [];
        let processedBases = new Set();

        orderDetails.packages.forEach((row) => {
            console.log(row.shipping_mark);
            const [base, count] = row.shipping_mark.split(' ');
            const [_, totalPackages] = count.split('-'); // '_' is a throwaway variable for the total
            const totalNumber = parseInt(totalPackages, 10);

            if (!processedBases.has(base)) {
                for (let i = 1; i <= totalNumber; i++) {
                    SMdetails.push({ smark: `${base} ${i}-${totalNumber}` });
                }
                processedBases.add(base);
            }
        });

        console.log(SMdetails);
        navigate('./shippingMarks', { state: { orderId: id, printables: SMdetails, category: orderDetails.order.category } });
    };




    const toPayment = () => {
        navigate('./payments', { state: { orderId: orderDetails.order.order_id, payments: orderDetails.payment } });
    }

    const toggleReadyStatus = () => {
        const oid = orderDetails.order.order_id;
        console.log("oid ", oid);

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            //buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Inform the Customer?",
            text: "SMS will send to the customer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Send it!",
            cancelButtonText: "No, only update status",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://localhost:3001/api/order/toggleReadyStatus', {
                    oid: oid,
                    sendSMS: true
                })
                    .then((response) => {
                        setOrderDetails(prevDetails => ({
                            ...prevDetails,
                            order: {
                                ...prevDetails.order,
                                status: response.data.status
                            }
                        }));
                    })
                    .catch((error) => {
                        console.error("Error toggling order status:", error);
                    });
                swalWithBootstrapButtons.fire({
                    title: "SMS send and Order status changed!",
                    // text: "Your file has been deleted.",
                    icon: "success"
                });
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                axios.post('http://localhost:3001/api/order/toggleReadyStatus', {
                    oid: oid,
                    sendSMS: true
                })
                    .then((response) => {
                        setOrderDetails(prevDetails => ({
                            ...prevDetails,
                            order: {
                                ...prevDetails.order,
                                status: response.data.status
                            }
                        }));
                    })
                    .catch((error) => {
                        console.error("Error toggling order status:", error);
                    });
                swalWithBootstrapButtons.fire({
                    title: "Order status changed!",
                    // text: "Your imaginary file is safe :)",
                    icon: "success"
                });
            }
        });
    }
    const toggleCompleteStatus = () => {
        const oid = orderDetails.order.order_id;
        console.log("oid ", oid);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        }).then((result) => {
            if (result.isConfirmed) {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger"
                    },
                    //buttonsStyling: false
                });
                swalWithBootstrapButtons.fire({
                    title: "Inform the Customer?",
                    text: "SMS will send to the customer",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Send it!",
                    cancelButtonText: "No, only update status",
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post('http://localhost:3001/api/order/completeOrder', {
                            oid: oid,
                            sendSMS: true
                        })
                            .then((response) => {
                                setOrderDetails(prevDetails => ({
                                    ...prevDetails,
                                    order: {
                                        ...prevDetails.order,
                                        status: response.data.status
                                    }
                                }));
                            })
                            .catch((error) => {
                                console.error("Error toggling order status:", error);
                            });
                        swalWithBootstrapButtons.fire({
                            title: "SMS send and Order completed!",
                            // text: "Your file has been deleted.",
                            icon: "success"
                        });
                    } else if (
                        /* Read more about handling dismissals below */
                        result.dismiss === Swal.DismissReason.cancel
                    ) {
                        axios.post('http://localhost:3001/api/order/completeOrder', {
                            oid: oid,
                            sendSMS: true
                        })
                            .then((response) => {
                                setOrderDetails(prevDetails => ({
                                    ...prevDetails,
                                    order: {
                                        ...prevDetails.order,
                                        status: response.data.status
                                    }
                                }));
                            })
                            .catch((error) => {
                                console.error("Error toggling order status:", error);
                            });
                        swalWithBootstrapButtons.fire({
                            title: "Order  Order completed!!",
                            // text: "Your imaginary file is safe :)",
                            icon: "success"
                        });
                    }
                });
            }
        });
    }

    const addCourier = () => {
        navigate('./couriers', { state: { orderId: orderDetails.order.order_id, courierId: orderDetails.order.courier_id } });
    }

    useEffect(() => {
        console.log("ID: ", id);
        axios.get(`http://localhost:3001/api/order/allById/${id}`)
            .then((response) => {
                setOrderDetails(response.data);
                //console.log(response.data);

                // Calculate initial subTotal and set discount
                let initialSubTotal = 0;
                response.data.packages.forEach((pkg) => {
                    initialSubTotal += parseFloat(pkg.total) || 0;
                });
                setSubTotal(initialSubTotal);
                setDiscount(orderDetails.invoice.discount);
                //console.log("ID 2 ", orderDetails.priceReq[0].quotation_id);
                //setLoading(false); // Set loading to false after data is fetched
            })
            .catch((error) => {
                console.error("Error fetching order details:", error);
                setLoading(false); // Set loading to false if there's an error
            });
        try {
            console.log("HERE ", orderDetails.priceReq[0].quotation_id)
            axios({
                url: `http://localhost:3001/api/priceQuotationRouter/download/image/${orderDetails.priceReq[0].quotation_id}`,
                method: "GET",
                responseType: "blob"
            }).then((res) => {
                // Get the content type from the response headers
                const contentType = res.headers['content-type'];
                //console.log("ID 3");
                //console.log("TYPE", contentType)

                // Determine the file extension based on the content type
                let extension = '';
                if (contentType === 'application/pdf') {
                    extension = 'pdf';
                } else if (contentType.startsWith('image/')) {
                    // Get the image type from the content type
                    extension = contentType.split('/')[1];
                } else {
                    console.error('Unsupported file type');
                    return;
                }

                // Optionally, set the image state if needed for further processing
                setImage(URL.createObjectURL(res.data));
                //console.log("orderDetails.payment ", orderDetails.payment)
                setLoading(false);
            })
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }, []);


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

    const downloadImage = async (e) => {
        e.preventDefault();
        try {
            axios({
                url: `http://localhost:3001/api/priceQuotationRouter/download/image/${orderDetails.priceReq[0].quotation_id}`,
                method: "GET",
                responseType: "blob"
            }).then((res) => {
                // Get the content type from the response headers
                const contentType = res.headers['content-type'];

                console.log("TYPE", contentType)

                // Determine the file extension based on the content type
                let extension = '';
                if (contentType === 'application/pdf') {
                    extension = 'pdf';
                } else if (contentType.startsWith('image/')) {
                    // Get the image type from the content type
                    extension = contentType.split('/')[1];
                } else {
                    console.error('Unsupported file type');
                    return;
                }

                // Create a filename with the appropriate extension
                const filename = `${orderDetails.priceReq[0].quotation_id}Image.${extension}`;

                // Save the file using FileSaver
                FileSaver.saveAs(new Blob([res.data], { type: contentType }), filename);

                // Optionally, set the image state if needed for further processing
                setImage(URL.createObjectURL(res.data));
            })
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }

    const downloadInvoice = async (e) => {
        e.preventDefault();
        try {
            axios({
                url: `http://localhost:3001/api/priceQuotationRouter/download/invoice/${orderDetails.priceReq[0].quotation_id}`,
                method: "GET",
                responseType: "blob"
            }).then((res) => {
                // Get the content type from the response headers
                const contentType = res.headers['content-type'];

                console.log("TYPE", contentType)

                // Determine the file extension based on the content type
                let extension = '';
                if (contentType === 'application/pdf') {
                    extension = 'pdf';
                } else if (contentType.startsWith('image/')) {
                    // Get the image type from the content type
                    extension = contentType.split('/')[1];
                } else {
                    console.error('Unsupported file type');
                    return;
                }

                // Create a filename with the appropriate extension
                const filename = `${orderDetails.priceReq[0].quotation_id}Invoice.${extension}`;
                FileDownload(res.data, filename)
            })
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }

    const totalPaymentsMade = orderDetails.payment.reduce((sum, payment) => sum + parseFloat(payment.payment) || 0, 0);
    const amountDue = orderDetails.invoice.total - totalPaymentsMade;

    return (
        <>
            <div>
                <Button onClick={toBack}>
                    Back
                </Button>
                {orderDetails.order.status == 'Just opened' ?
                    "" : <>
                        <Button onClick={toShippingMarks}>
                            Shipping Marks
                        </Button>
                        <Button onClick={toInvoice}>
                            Invoice
                        </Button>
                    </>}
                <Button onClick={addCourier}>
                    Add courier
                </Button>
                {orderDetails.order.status == 'onhand' || orderDetails.order.status == 'Ready' ?
                    <Button onClick={toggleReadyStatus}>
                        {orderDetails.order.status == 'Ready' ? 'Change as not Ready' : 'Change as Ready'}
                    </Button>
                    : ''}
                <Button onClick={toPayment}>
                    Payments
                </Button>
                {orderDetails.order.status == 'Ready' ?
                    <Button variant="contained" onClick={toggleCompleteStatus}>
                        Complete Order
                    </Button>
                    : ''}
                <Box component="h1">Order ID: {orderDetails.order.order_id}</Box>
                <Box component="h2">Status: {orderDetails.order.status}</Box>

                {/* INVOICE */}
                <Box component="div" sx={{ width: '1000px', p: '2rem', border: '1px black solid' }}>
                    {/* <Box component="p">Invoice ID: {orderDetails.invoice.invoice_id}</Box> */}

                    <Box component="p">Customer ID: {orderDetails.customer.customer_id}</Box>
                    <Box component="p">Name: {orderDetails.customer.f_name} {orderDetails.customer.l_name}</Box>
                    <Box component="p">Tel. number: 0{orderDetails.customer.tel_number}</Box>
                    <Box component="p">Address: {orderDetails.customer.address}</Box>
                    <Box component="p">Assign To: {orderDetails.courier != null ? orderDetails.courier.courier_id : ''} - {orderDetails.courier != null ? orderDetails.courier.name : ''}</Box>
                    <Box component="p">Open date: {orderDetails.order.order_open_date}</Box>
                    <Box component="p">Shipment: {orderDetails.order.BL_no}</Box>
                    <Box component="p">From: {orderDetails.order.supplier_loc}</Box>
                    <Box component="p">Category: {orderDetails.order.category}</Box>
                    <table style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={tableCell}>Shipping Marks</th>
                                <th style={tableCell}>Count</th>
                                <th style={tableCell}>L</th>
                                <th style={tableCell}>H</th>
                                <th style={tableCell}>V.W.</th>
                                <th style={tableCell}>G.W.</th>
                                {orderDetails.priceReq[0].shipping_method == 'Air cargo' ?
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
                                    <td style={tableCell}>{row.chargable_weight || ''}</td>
                                    <td style={tableCell}>{row.rate || ''}</td>
                                    <td style={tableCell}>{row.tax || '0'}</td>
                                    <td style={tableCell}>{row.total || '0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Box component="div" sx={{ display: 'flex', justifyContent: 'flex-end', mt: '0.5rem', mr: '1rem' }}>
                        <table style={{ width: '220px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'left' }}><Box component="h4">Sub Total</Box></td>
                                    <td style={{ textAlign: 'right' }}><Box component="h4">{subTotal}.00</Box></td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: 'left' }}><Box component="h4">Discount</Box></td>
                                    <td style={{ textAlign: 'right' }}><Box component="h4">{orderDetails.invoice.discount}</Box></td>
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



            {/*Payments*/}
            <Box component="h3" sx={{}}>Total Payments: {orderDetails.payment.reduce((sum, payment) => sum + parseFloat(payment.payment) || 0, 0)}</Box>
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
                    {orderDetails.payment.map((payment, index) => (
                        <tr>
                            <td style={tableCell}>{payment.payment_id}</td>
                            <td style={tableCell}>{payment.payment_method}</td>
                            <td style={tableCell}>{payment.payment}</td>
                            <td style={tableCell}>{payment.date_time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Price quotation details*/}
            <Box component="div"
                sx={{ display: 'flex', justifyContent: 'space-around', mt: '1rem' }}>
                <Box component="div">
                    <Box component="h3" sx={{ mb: 2 }}>Price quotation details</Box>
                    <table style={{ border: '1px solid gray', padding: '1rem' }}>
                        <tr>
                            <td>Items:</td>
                            <td>{orderDetails.priceReq[0].items}</td>
                        </tr>
                        <tr>
                            <td>No of packages:</td>
                            <td>{orderDetails.priceReq[0].no_of_packages}</td>
                        </tr>
                        <tr>
                            <td>Rough weight(Kg):</td>
                            <td>{orderDetails.priceReq[0].raugh_weight}</td>
                        </tr>
                        <tr>
                            <td>No of packages:</td>
                            <td>{orderDetails.priceReq[0].no_of_packages}</td>
                        </tr>
                        <tr>
                            <td>description</td>
                            <td>{orderDetails.priceReq[0].description}</td>
                        </tr>
                        <tr>
                            <td>Quotation(LKR)</td>
                            <td>{orderDetails.priceReq[0].quotation}</td>
                        </tr>
                        <tr>
                            <td>Shipping method:</td>
                            <td>{orderDetails.priceReq[0].shipping_method}</td>
                        </tr>
                        <tr>
                            <td>status:</td>
                            <td>{orderDetails.priceReq[0].status}</td>
                        </tr>
                        <tr>
                            <td><label for="invoice">Image :</label></td>
                            <td>
                                {addImage ? (
                                    <div>
                                        {image && (
                                            <div style={{ marginTop: '10px' }}>
                                                <img
                                                    src={image}
                                                    alt="Preview"
                                                    style={{ width: '200px', borderRadius: '5px' }}
                                                />
                                            </div>
                                        )}
                                        <Box component="p" onClick={downloadImage} style={{ cursor: 'pointer', color: 'blue' }}>
                                            Download
                                        </Box>
                                        {/* <Box component="p"onClick={toggleAddImage} style={{ cursor: 'pointer', color: 'blue' }}>
                                                        add new image
                                                    </Box> */}
                                    </div>
                                ) : (
                                    <div>
                                        <Field
                                            type="file"
                                            id="image"
                                            name="image"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            style={{
                                                border: '1px solid #ccc',
                                                padding: '10px',
                                                borderRadius: '5px',
                                                marginTop: '10px',
                                                width: '200px',
                                            }}
                                        />
                                        {/* <Box component="p" onClick={toggleAddImage} style={{ cursor: 'pointer', color: 'blue' }}>
                                            cancel
                                        </Box> */}
                                    </div>
                                )}

                            </td>
                        </tr>
                        <tr>
                            <td><label for="invoice">Performa invoice :</label></td>
                            <td>
                                <Box component="p" onClick={(e) => downloadInvoice(e)}>Download</Box>
                            </td>
                        </tr>
                    </table>
                </Box>
            </Box>
        </>
    )
}

export default ViewOrder;
