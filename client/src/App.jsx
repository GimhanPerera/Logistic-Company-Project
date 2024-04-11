import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';
import { RootLayout } from './RootLayout';
import CourierDetails from './managementSystem/Pages/Courier/courierDetails';
import CustomersDetails from './managementSystem/Pages/Customer/customersDetails';
import Dashboard from './managementSystem/Pages/Dashboard/Dashboard';
import OrderDetails from './managementSystem/Pages/Order/orderDetails';
import ManagmentSystem from './managementSystem/managmentSystem';
import { CustomerLogin } from './website/CustomerLogin';
import { StaffLogin } from './website/StaffLogin';
import { Website } from './website/website';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
      <Route index element={<Website/>}></Route>
      <Route path="stafflogin" element={<StaffLogin/>}></Route>
      <Route path="checkmyorder" element={<CustomerLogin/>}></Route>
      <Route path="cmsystem" element={<ManagmentSystem/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='customers' element={<CustomersDetails/>}/>
        <Route path='courier' element={<CourierDetails/>}/>
        <Route path='order' element={<OrderDetails/>}/>
      </Route>
    </Route>
  )
)

function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
