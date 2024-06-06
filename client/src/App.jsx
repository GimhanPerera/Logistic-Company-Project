import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ComplainDetails from './managementSystem/Pages/Complain/complainDetails';
import CourierDetails from './managementSystem/Pages/Courier/courierDetails';
import CustomersDetails from './managementSystem/Pages/Customer/customersDetails';
import { EditCustomer } from './managementSystem/Pages/Customer/editCustomer';
import Dashboard from './managementSystem/Pages/Dashboard/Dashboard';
import { EditEmployee } from './managementSystem/Pages/Employee/editEmployee';
import EmpDetails from './managementSystem/Pages/Employee/empDetails';
import AddCourierToOrder from './managementSystem/Pages/Order/addCourierToOrder';
import DisplayShippingMark from './managementSystem/Pages/Order/displayShippingMarks';
import InvoicePage from './managementSystem/Pages/Order/invoicePage';
import NewOrder from './managementSystem/Pages/Order/newOrder';
import OrderDetails from './managementSystem/Pages/Order/orderDetails';
import { Packages } from './managementSystem/Pages/Order/packages';
import Payment from './managementSystem/Pages/Order/payment';
import PrintShippingMarks from './managementSystem/Pages/Order/printShippingMarks';
import ScanAndUpdate from './managementSystem/Pages/Order/scanAndUpdate';
import UpdateTracking from './managementSystem/Pages/Order/updateTracking';
import ViewOrder from './managementSystem/Pages/Order/viewOrder';
import Reports from './managementSystem/Pages/Reports/Reports';
import AddEditShipment from './managementSystem/Pages/Shipment/addEditShipment';
import { ShipmentDetails } from './managementSystem/Pages/Shipment/shipmentDetails';
import { AddSpecialNotices } from './managementSystem/Pages/SpecialNotices/addSpecialNotices';
import { SpecialNotices } from './managementSystem/Pages/SpecialNotices/specialNotices';
import OrderRequest from './managementSystem/Pages/orderRequest/orderRequest';
import RequestHandle from './managementSystem/Pages/orderRequest/requestHandle';
import { ProfilePage } from './managementSystem/Pages/profilePage';
import ManagmentSystem from './managementSystem/managmentSystem';
import { TestFile } from './testfile';
import { StaffLogin } from './website/StaffLogin';
import { AllMyOrders } from './website/allMyOrders';
import { CustomerLogin } from './website/customerLogin';
import { NewOrderRequest } from './website/newOrderRequest';
import { OrderTrackingDetails } from './website/orderTrackingDetails';
import { OrderTrackingDetailsValidated } from './website/orderTrackingDetailsValidated';
import { Website } from './website/website';

function App() {
const [currentUser, setCurrentUser] = useState(undefined);
useEffect(() => {
  const userRole = localStorage.getItem("user");
  if (userRole) {
    const parsedUserRole = JSON.parse(userRole); // Parse the string into an object
    setCurrentUser(parsedUserRole.role);
  }
  console.log("userChecked", userRole);
  console.log("ROLE: ", currentUser); // Log the role correctly
}, []);

  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route path="test1" element={<TestFile />} /> {/* Testing this */}
          <Route path="test2" element={<PrintShippingMarks />} /> {/* Testing this */}
          <Route index element={<Website />} />
          <Route path="stafflogin" element={<StaffLogin />} />
          <Route path="checkmyorder">
            <Route index element={<CustomerLogin />} />
            <Route path=":trackingNumber" element={<OrderTrackingDetails />} />
            <Route path="myorders">
              <Route index element={<AllMyOrders />} />
              <Route path=":id" element={<OrderTrackingDetailsValidated />} />
              <Route path="request" element={<NewOrderRequest />} />
            </Route>
          </Route>
          {['ADMIN', 'MANAGER', 'EMP'].includes(currentUser) && (
          <Route path="cmsystem" element={<ManagmentSystem />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" >
            <Route index element={<CustomersDetails />} />
            <Route path="view" element={<EditCustomer />} />
            </Route>
            <Route path="employee" >
            <Route index element={<EmpDetails />} />
            <Route path="view" element={<EditEmployee />} />
            </Route>
            <Route path="requests">
              <Route index element={<OrderRequest />} />
              <Route path=":priceQ" element={<RequestHandle />} />
            </Route>
            <Route path="courier" element={<CourierDetails />} />
            <Route path="order">
              <Route index element={<OrderDetails />} />
              <Route path=":id" element={<Packages />} />
              <Route path="updatetracking" element={<UpdateTracking />} />
              <Route path="view">
                <Route index element={<ViewOrder />} />
                <Route path=":id" element={<InvoicePage />} />
                <Route path="payments" element={<Payment />} />
                <Route path="couriers" element={<AddCourierToOrder />} />
                <Route path="shippingMarks" element={<DisplayShippingMark />} />
              </Route>
            </Route>
            <Route path="shipment">
              <Route index element={<ShipmentDetails />} />
              <Route path="details" element={<AddEditShipment />} />
              <Route path="scan" element={<ScanAndUpdate />} />
            </Route>
            <Route path="SpecialNotices">
              <Route index element={<SpecialNotices/>} />
              <Route path="addEdit" element={<AddSpecialNotices/> }/>
            </Route>
            <Route path="complain">
              <Route index element={<ComplainDetails/>} />
            </Route>
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<ProfilePage />} />

            <Route path="neworder" element={<NewOrder />} />

          </Route>
          )}
        </Route>
        {/* <Route path="*" element={<h1>NO ROUTE</h1>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
