import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { RootLayout } from './RootLayout';
import CourierDetails from './managementSystem/Pages/Courier/courierDetails';
import CustomersDetails from './managementSystem/Pages/Customer/customersDetails';
import Dashboard from './managementSystem/Pages/Dashboard/Dashboard';
import NewOrder from './managementSystem/Pages/Order/newOrder';
import OrderDetails from './managementSystem/Pages/Order/orderDetails';
import Reports from './managementSystem/Pages/Reports/Reports';
import { ShipmentDetails } from './managementSystem/Pages/Shipment/shipmentDetails';
import ManagmentSystem from './managementSystem/managmentSystem';
import { CustomerLogin } from './website/CustomerLogin';
import { StaffLogin } from './website/StaffLogin';
import { AllMyOrders } from './website/allMyOrders';
import { OrderTrackingDetails } from './website/orderTrackingDetails';
import { Website } from './website/website';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Website />} />
          <Route path="stafflogin" element={<StaffLogin />} />
          <Route path="checkmyorder">
            <Route index element={<CustomerLogin />} />
            <Route path=":trackingNumber" element={<OrderTrackingDetails/>}/>
            <Route path="myorders" element={<AllMyOrders/>}/>
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
