import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const NewOrder = () => {
    const navigate = useNavigate();
    const [listOfOrderDetails, setListOfOrder] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/order").then((response)=>{
            setListOfOrder(response.data);
        })
    }, [])
    const toOrders = () => {
        navigate('../order');
      }

    return (
    <div className="relative">
        <form>
            <h3>Price quotation details</h3>
            <table className="border-solid border-2 border-black m-2">
                <tr>
                    <td><label for="items">Items :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                </tr>
                <tr>
                    <td><label for="packages">No of packages :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                </tr>
                <tr>
                    <td><label for="weight">Rough weight(Kg)  :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                </tr>
                <tr>
                    <td><label for="shippingmethod">Shipping method :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                </tr>
                <tr>
                    <td><label for="quotation">Quotation(LKR per kilo) :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                </tr>
                <tr>
                    <td><label for="description">Description :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                </tr>
                <tr>
                    <td><label for="image">Image :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                </tr>
                <tr>
                    <td><label for="invoice">Performa invoice :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                </tr>
            </table>
            <h3>Customer Details</h3>
            <table className="border-solid border-2 border-black m-2">
                <tr>
                    <td><label for="cus_id">Customer ID :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                    <td><a>Search</a></td>
                </tr>
                <tr>
                    <td><label for="name">Name :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                </tr>
                <tr>
                    <td><label for="tel_number">Tel number :</label></td>
                    <td><input type="text" id="items" name="items" className="border-solid border-2 border-blue-800"/></td>
                </tr>
                <tr>
                    <td></td>
                    <td><p>New customer?</p><a>Yes</a></td>
                </tr>
            </table>
            <button  onClick={toOrders} className="bg-[#ffffff] hover:bg-blue-600 text-[#68DD62] border-solid border-2 border-[#68DD62] px-4 py-2 rounded-md focus:outline-none ml-2">
                Cancel
            </button>
            <button type="submit" className="bg-[#68DD62] text-white px-4 py-2 rounded-md border-solid border-2 border-[#68DD62] focus:outline-none ml-2">
                Create order
            </button>
        </form>
        <div>
            
        </div>
    </div>
    )

}

export default NewOrder