import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from "axios";
import React, { useEffect, useState } from 'react';

//Details card template
const DemoPaper = styled(Paper)(({ theme }) => ({
  width: 210,
  height: 100,
  padding: theme.spacing(1),
  ...theme.typography.body2,
  color: 'white',
  margin: '0.5rem'
}));


//Dashboard
const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState('');//dashboard data
  const [totalIncome, setTotalIncome] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const userRole = localStorage.getItem("user");
    if (userRole) {
      const parsedUserRole = JSON.parse(userRole); // Parse the string into an object
      setCurrentUser(parsedUserRole.role);
    }
  }, []);

  //Load dashboard data
  useEffect(() => {
    axios.get("http://localhost:3001/api/dashboard")
      .then((response) => {
        setDashboardData(response.data);//set data
        setTotalIncome(response.data.monthlyIncomeForChat.map(data => data.totalIncome));//set income data
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, []);

  return (
    <>
      {/* Box row 1 */}
      <Box component="div" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

        {/* Total income - Year */}
        <DemoPaper square={false} sx={{
          background: 'linear-gradient(45deg, #32CD32, #008000)'
        }}>
          <Box component="p" sx={{ fontSize: '1rem' }}>This year</Box>
          <Box component="p" sx={{ fontSize: '1.4rem', mt: '-0.5rem' }}>Total Income(LKR)</Box>
          <Box component="p" sx={{ fontSize: '1.7rem', fontWeight: '700', mt: '-0.1rem', fontFamily: 'sans-serif', textAlign: 'center' }}>{dashboardData.totalIncomeThisYear}</Box>
        </DemoPaper>

        {/* Total income - Month */}
        <DemoPaper square={false} sx={{
          background: 'linear-gradient(45deg, #32CD32, #008000)'
        }}>
          <Box component="p" sx={{ fontSize: '1rem' }}>This month</Box>
          <Box component="p" sx={{ fontSize: '1.4rem', mt: '-0.5rem' }}>Total Income(LKR)</Box>
          <Box component="p" sx={{ fontSize: '1.7rem', fontWeight: '700', mt: '-0.1rem', fontFamily: 'sans-serif', textAlign: 'center' }}>{dashboardData.totalIncomeThisMonth}</Box>
        </DemoPaper>

        {/* Active shipment */}
        <DemoPaper square={false} sx={{
          background: 'linear-gradient(45deg, #32CD32, #008000)'
        }}>
          <Box component="p" sx={{ fontSize: '1rem' }}>Active</Box>
          <Box component="p" sx={{ fontSize: '1.4rem', mt: '-0.5rem' }}>Shipments</Box>
          <Box component="p" sx={{ fontSize: '1.7rem', fontWeight: '700', mt: '-0.1rem', fontFamily: 'sans-serif', textAlign: 'center' }}>{dashboardData.activeShipmentsCount}</Box>
        </DemoPaper>

        {/* Active orders */}
        <DemoPaper square={false} sx={{
          background: 'linear-gradient(45deg, #32CD32, #008000)'
        }}>
          <Box component="p" sx={{ fontSize: '1rem' }}>Active</Box>
          <Box component="p" sx={{ fontSize: '1.4rem', mt: '-0.5rem' }}>Orders</Box>
          <Box component="p" sx={{ fontSize: '1.7rem', fontWeight: '700', mt: '-0.1rem', fontFamily: 'sans-serif', textAlign: 'center' }}>{dashboardData.activeOrderCount}</Box>
        </DemoPaper>

        {/* Price quotation count */}
        <DemoPaper square={false} sx={{
          background: 'linear-gradient(45deg, #32CD32, #008000)'
        }}>
          <Box component="p" sx={{ fontSize: '1rem' }}>Price</Box>
          <Box component="p" sx={{ fontSize: '1.4rem', mt: '-0.5rem' }}>Requests count</Box>
          <Box component="p" sx={{ fontSize: '1.7rem', fontWeight: '700', mt: '-0.1rem', fontFamily: 'sans-serif', textAlign: 'center' }}>{dashboardData.PriceRequestCount}</Box>
        </DemoPaper>
      </Box>

      {/* Only visible to admin and manager */}
      {['ADMIN', 'MANAGER'].includes(currentUser) && (
        <>
          {/* Box row 2 */}
          {/* Complain count */}
          <Box component="div" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <DemoPaper square={false} sx={{
              background: 'linear-gradient(45deg, #32CD32, #008000)'
            }}>
              <Box component="p" sx={{ fontSize: '1.4rem', textAlign: 'center' }}>Complains</Box>
              <Box component="p" sx={{ fontSize: '1.7rem', fontWeight: '700', mt: '0.1rem', fontFamily: 'sans-serif', textAlign: 'center' }}>{dashboardData.totalPendingComplains}</Box>
            </DemoPaper>
            {/* Customers count */}
            <DemoPaper square={false} sx={{
              background: 'linear-gradient(45deg, #32CD32, #008000)'
            }}>
              <Box component="p" sx={{ fontSize: '1.4rem', mt: '-0.1rem', ml: '0.3rem' }}>Customers</Box>
              <Box component="p" sx={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'sans-serif', ml: '2rem', mt: '0.4rem' }}>{dashboardData.totalCustomerCount}</Box>
              <table style={{ position: 'relative', bottom: '45px', left: '80px' }}>
                <tbody>
                  {dashboardData.statusViseCustomerCounts && dashboardData.statusViseCustomerCounts.map((customer, index) => (
                    <tr>
                      <td> <Box component="p" key={index} sx={{ fontSize: '1.1rem', mt: '-0.5rem' }}>{customer.status}</Box>
                      </td>
                      <td>
                        <Box component="p" key={index} sx={{ fontSize: '1.1rem', mt: '-0.5rem' }}>: {customer.count}</Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DemoPaper>
            {/* Employee count */}
            <DemoPaper square={false} sx={{
              background: 'linear-gradient(45deg, #32CD32, #008000)'
            }}>
              <Box component="p" sx={{ fontSize: '1.4rem', mt: '-0.1rem', ml: '0.3rem' }}>Employees</Box>
              <Box component="p" sx={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'sans-serif', ml: '2rem', mt: '0.4rem' }}>{dashboardData.totalEmpCount}</Box>
              <table style={{ position: 'relative', bottom: '45px', left: '80px' }}>
                <tbody>
                  {dashboardData.statusViseEmpCounts && dashboardData.statusViseEmpCounts.map((customer, index) => (
                    <tr>
                      <td> <Box component="p" key={index} sx={{ fontSize: '1.1rem', mt: '-0.5rem' }}>{customer.status}</Box>
                      </td>
                      <td>
                        <Box component="p" key={index} sx={{ fontSize: '1.1rem', mt: '-0.5rem' }}>: {customer.count}</Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DemoPaper>

          </Box>
        </>
      )}

      {/* row 3 */}
      <Box component="div" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: '1rem' }}>
        {/* Monthly income chart */}
        <Paper elevation={3} component="div" sx={{ width: '30rem', m: '1rem', p: '1rem' }}>
          <Box component="h2" sx={{ textAlign: 'center' }}>Monthly Income</Box>
          <BarChart
            xAxis={[{ scaleType: 'band', data: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] }]}
            series={[{ label: 'Income', data: totalIncome }]}
            width={500}
            height={300}
          />
        </Paper>

        {/* Pie Chart: Category vise order count in this year */}
        {dashboardData && dashboardData.orderCountforEachCategory && (
          <Paper elevation={3} component="div" sx={{ width: '30rem', m: '1rem', p: '1rem' }}>
            <Box component="h2" sx={{ textAlign: 'center', mb: '3rem' }}>Category vise order count in this year</Box>
            <PieChart
              series={[
                {
                  data: dashboardData.orderCountforEachCategory.map((category, index) => ({
                    id: index,
                    value: category.orderCount,
                    label: category.category
                  }))
                }
              ]}
              width={400}
              height={200}
            />
          </Paper>
        )}
      </Box>

    </>
  )
}

export default Dashboard
