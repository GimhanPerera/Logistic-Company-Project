import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import CourierDetails from './managementSystem/Pages/Courier/courierDetails';
import CustomersDetails from './managementSystem/Pages/Customer/customersDetails';
import Dashboard from './managementSystem/Pages/Dashboard/Dashboard';
import NewOrder from './managementSystem/Pages/Order/newOrder';
import OrderDetails from './managementSystem/Pages/Order/orderDetails';
import Reports from './managementSystem/Pages/Reports/Reports';
import { ShipmentDetails } from './managementSystem/Pages/Shipment/shipmentDetails';
import ManagmentSystem from './managementSystem/managmentSystem';
import { StaffLogin } from './website/StaffLogin';
import { AllMyOrders } from './website/allMyOrders';
import { CustomerLogin } from './website/customerLogin';
import { OrderTrackingDetails } from './website/orderTrackingDetails';
import { OrderTrackingDetailsValidated } from './website/orderTrackingDetailsValidated';
import { Website } from './website/website';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<Website />} />
          <Route path="stafflogin" element={<StaffLogin />} />
          <Route path="checkmyorder">
            <Route index element={<CustomerLogin />} />
            <Route path=":trackingNumber" element={<OrderTrackingDetails/>}/>
            <Route path="myorders">
              <Route index element={<AllMyOrders />} />
              <Route path=":id" element={<OrderTrackingDetailsValidated/>}/>
            </Route>
          </Route>
          <Route path="cmsystem" element={<ManagmentSystem />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<CustomersDetails />} />
            <Route path="courier" element={<CourierDetails />} />
            <Route path="order" element={<OrderDetails />} />
            <Route path="shipment" element={<ShipmentDetails />} />
            <Route path="reports" element={<Reports />} />

            <Route path="neworder" element={<NewOrder />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
