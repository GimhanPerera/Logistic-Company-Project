import axios from "axios";
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const initialVslues = {
    item: '',
    packages: '',
    weight: '',
    shippingmethod: '',
    quotation: '',
    description: '',
    supplierLoc: '',
    cusID: '',
    name: '',
    tp: '',
}


const NewOrder = () => {
    const [customerID, setCustomerID] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerTp, setCustomerTp] = useState("");
    const navigate = useNavigate();
    const toOrders = () => {
        navigate('../order');
    }
    const [formData, setFormData] = useState({

        item: '',
        packages: '',
        weight: '',
        shippingmethod: '',
        quotation: '',
        description: '',
        supplierLoc: '',
        image: null,
        invoice: "",
        cusID: "",
        name: "",
        tp: '',
    }); 
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0] // Update the image file in the form data
        });
    };

    const handleSubmit = async (e) => { //Submit the order
        e.preventDefault();
        
        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        try {
            await axios.post("http://localhost:3001/api/order", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Optionally, redirect the user to another page after successful submission
            //navigate('../order');
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };


    const searchCustomer = async (e) => {//serach customer
        console.log(customerID);
        axios.get(`http://localhost:3001/api/customers/search/${customerID}`, {
        }).then((response) => {
            setCustomerName(response.data.name)
            setCustomerTp(response.data.tel_number)
            setFormData({
                ...formData,
                'cusID': customerID,
                'name': response.data.name,
                'tp': response.data.tel_number,
            });

        }).catch((error) => {
            console.error('Error :', error);
        });
    }


    return (
        <div className="relative">
            <Formik
                initialValues={initialVslues}
            >
                <Form onSubmit={handleSubmit}>
                    <h3>Price quotation details</h3>
                    <table className="border-solid border-2 border-black m-2">
                        <tr>
                            <td><label for="item">Items :</label></td>
                            <td><Field type='text' name='item' value={formData.item} id="item" onChange={handleChange} className="border-solid border-2 border-blue-800" /></td>
                        </tr>
                        <tr>
                            <td><label for="packages">No of packages :</label></td>
                            <td><Field type='text' name='packages' value={formData.packages} onChange={handleChange} className="border-solid border-2 border-blue-800" /></td>
                        </tr>
                        <tr>
                            <td><label for="weight">Rough weight(Kg)  :</label></td>
                            <td><Field type='text' name='weight' value={formData.weight} onChange={handleChange} className="border-solid border-2 border-blue-800" /></td>
                        </tr>
                        <tr>
                            <td><label for="shippingmethod">Shipping method :</label></td>
                            <td><Field type='text' name='shippingmethod' value={formData.shippingmethod} onChange={handleChange} className="border-solid border-2 border-blue-800" /></td>
                        </tr>
                        <tr>
                            <td><label for="quotation">Quotation(LKR per kilo) :</label></td>
                            <td><Field type='text' name='quotation' value={formData.quotation} onChange={handleChange} className="border-solid border-2 border-blue-800" /></td>
                        </tr>
                        <tr>
                            <td><label for="description">Description :</label></td>
                            <td><Field type='text' name='description' value={formData.description} onChange={handleChange} className="border-solid border-2 border-blue-800" /></td>
                        </tr>
                        <tr>
                            <td><label for="supplierLoc">Supplier Location :</label></td>
                            <td><Field type='text' name='supplierLoc' value={formData.supplierLoc} onChange={handleChange} className="border-solid border-2 border-blue-800" /></td>
                        </tr>
                        <tr>
                            <td><label for="image">Image :</label></td>
                            <td><Field type="file" id="image" name="image" onChange={handleImageChange} className="border-solid border-2 border-blue-800" /></td>
                        </tr>
                        <tr>
                            <td><label for="invoice">Performa invoice :</label></td>
                            <td><input type="text" id="invoice" name="invoice" value={formData.invoice} onChange={handleChange} className="border-solid border-2 border-blue-800" /></td>
                        </tr>
                    </table>
                    <h3>Customer Details</h3>
                    <table className="border-solid border-2 border-black m-2">
                        <tr>
                            <td><label for="cus_id">Customer ID :</label></td>
                            <td><Field type="text"
                                name="cusID"
                                id="customerId"
                                value={customerID}
                                onChange={(e) => setCustomerID(e.target.value)} className="border-solid border-2 border-blue-800" /></td>
                            <td><p
                                className="cursor-pointer"
                                onClick={searchCustomer}
                            >Search</p></td>
                        </tr>
                        <tr>
                            <td><label for="name">Name :</label></td>
                            <td><Field type="text"
                                name="name"
                                id="name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="border-solid border-2 border-blue-800" /></td>
                        </tr>
                        <tr>
                            <td><label for="tel_number">Tel number :</label></td>
                            <td><Field type="text"
                                id="tp"
                                name="tp"
                                value={customerTp}
                                onChange={(e) => setCustomerTp(e.target.value)}
                                className="border-solid border-2 border-blue-800" />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><p>New customer?</p><p className="cursor-pointer">Yes</p></td>
                        </tr>
                    </table>
                    <button onClick={toOrders} className="bg-[#ffffff] hover:bg-blue-600 text-[#68DD62] border-solid border-2 border-[#68DD62] px-4 py-2 rounded-md focus:outline-none ml-2">
                        Cancel
                    </button>
                    <button type="submit" className="bg-[#68DD62] text-white px-4 py-2 rounded-md border-solid border-2 border-[#68DD62] focus:outline-none ml-2">
                        Create order
                    </button>
                </Form>
            </Formik>
            <div>

            </div>
        </div>
    )

}

export default NewOrder

// For identify a customer
// GET http://localhost:3001/api/customer/searchCustomerByID