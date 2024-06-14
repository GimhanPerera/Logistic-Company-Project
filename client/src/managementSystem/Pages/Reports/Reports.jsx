import PrintIcon from '@mui/icons-material/Print';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from "axios";
import React, { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';

const Reports = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [reportType, setReportType] = useState('income-y');
  const [disableControls, setDisableControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();
  const [reportData, setReportData] = useState({ combinedReport: [] });
  const years = [];
  for (let year = 2023; year <= currentYear; year++) {
    years.push(year);
  }

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Filter months based on selected year
  const filteredMonths = selectedYear === currentYear
    ? months.filter(month => month.value <= currentMonth)
    : months;

  const handleYearChange = (event) => {
    setLoading(true);
    setSelectedYear(event.target.value);
    // Reset month if the selected year changes
    if (event.target.value === currentYear && selectedMonth > currentMonth) {
      setSelectedMonth('');
    }
  };

  const handleMonthChange = (event) => {
    setLoading(true);
    setSelectedMonth(event.target.value);
  };

  const handleTypeChange = (event) => {
    setLoading(true);
    event.target.value == 'income-m' ? setDisableControls(false) : setDisableControls(true);
    setReportType(event.target.value);
  };
  const getMonthLabel = (monthValue) => {
    const month = months.find(m => m.value === monthValue);
    return month ? month.label : 'Unknown';
  }

  //------------------------------------------------------

  const buttonClick = () => {
    let url = `http://localhost:3001/api/report/income/yearReport?year=${selectedYear}`;
    if (reportType == 'income-m')
      url = `http://localhost:3001/api/report/income/monthReport?year=${selectedYear}&month=${selectedMonth}`;
    else if (reportType == 'package-y')
      url = `http://localhost:3001/api/report/package/monthReport?year=${selectedYear}`;
    //axios.get(`http://localhost:3001/api/report/income/yearReport?year=${year}&month=${month}`)
    axios.get(url)
      .then((response) => {
        setReportData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  };

  const tableCell = {
    border: '1px solid #dddddd',
    padding: '8px'
  }
  const tableRowStyle = {
    padding: '0.2rem',
    border: '1px solid black'
  }
  const renderContent = () => {
    switch (reportType) {
      case 'income-y':
        return <Box component="div" sx={{ width: '1000px', p: '2rem', border: '1px black solid', borderRadius: '10px', mb: '2rem' }}>
          <Box component="h1" sx={{ textAlign: 'center', marginBottom: '3rem' }}>INCOME REPORT - {selectedYear} YEAR</Box>
          <Box component='div' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box component='div'>
              <Box component="h2" sx={{}}>Highest Income month: {getMonthLabel(reportData.mostIncome.month)}</Box>
              <Box component="h2" sx={{}}>Income: LKR {reportData.mostIncome.totalIncome}</Box>
            </Box>
            <Box component='div'>
              <Box component="h2" sx={{}}>Lowest Income month: {getMonthLabel(reportData.lessIncome.month)}</Box>
              <Box component="h2" sx={{}}>Income: LKR {reportData.lessIncome.totalIncome}</Box>
            </Box>
          </Box>
          <Box component='div' sx={{ m: '2rem 0' }}>
            <Box component="h3" sx={{}}>Total income of the Year: LKR {reportData.totalIncomeOfYear}</Box>
            <Box component="h3" sx={{}}>Total quotation of the Year: LKR {reportData.totalPriceQuotationsOfYear}</Box>
            <Box component="h3" sx={{}}>Difference between Income total  and Quotation total: LKR {(parseFloat(reportData.totalIncomeOfYear) - parseFloat(reportData.totalPriceQuotationsOfYear)).toFixed(2)}</Box>
          </Box>

          {/* main table */}
          <table style={{ borderCollapse: 'collapse', width: '600px', margin: 'auto', }}>
            <thead>
              <tr>
                <th style={{ ...tableCell, minWidth: '200px' }}>Month</th>
                <th style={{ ...tableCell, minWidth: '200px' }}>Total Orders</th>
                <th style={{ ...tableCell, minWidth: '200px' }}>Total Income</th>
              </tr>
            </thead>
            <tbody>
              {reportData.monthTable.length > 0 ? (
                reportData.monthTable.map((report, index) => (
                  <tr key={index}>
                    <td style={tableCell}>{getMonthLabel(report.month)}</td>
                    <td style={tableCell}>{report.totalOrders}</td>
                    <td style={tableCell}>{report.totalIncome}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={{ ...tableCell, textAlign: 'center', padding: '1rem', fontWeight: '900' }} colSpan="4">No Data</td>
                </tr>
              )}
            </tbody>
          </table>


          <Box component="div" sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', mt: '2rem' }}>
            <Box component="div" sx={{ }}>
              <Box component="h5">CREATIVE FREIGHTWAY LOGISTIC(PVT)LTD<br />No25A/2,<br />Thoranawila Junction,<br />Makandana,<br />Piliyandala.<br />94712055774</Box>
            </Box>
          </Box>
        </Box>;
      case 'income-m':
        return <Box component="div" sx={{ width: '1000px', p: '2rem', border: '1px black solid', borderRadius: '10px', mb: '2rem' }}>
          <Box component="h1" sx={{ textAlign: 'center', marginBottom: '1rem' }}>INCOME REPORT - {selectedYear}-{getMonthLabel(selectedMonth)}</Box>
            <Box component="h3" sx={{textAlign: 'center', marginBottom: '3rem'}}>Total income of the Month: LKR {reportData.totalIncomeOfMonth}</Box>

          {/* main table */}
          <table style={{ borderCollapse: 'collapse', width: '600px', margin: 'auto', }}>
            <thead>
              <tr>
                <th style={{ ...tableCell, minWidth: '200px' }}>Month</th>
                <th style={{ ...tableCell, minWidth: '200px' }}>Total Income</th>
              </tr>
            </thead>
            <tbody>
              {reportData.totalIncomeOfEachDay.length > 0 ? (
                reportData.totalIncomeOfEachDay.map((report, index) => (
                  <tr key={index}>
                    <td style={tableCell}>{report.date}</td>
                    <td style={tableCell}>{report.totalIncome}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={{ ...tableCell, textAlign: 'center', padding: '1rem', fontWeight: '900' }} colSpan="4">No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>;
      case 'package-y': {

        const chartSetting = {
          xAxis: [
            {
              label: 'Count',
            },
          ],
          width: 580,
          height: 460,
        };
        // Transform data to fit the BarChart format
        const transformDataForBarChart = (packageData, shipmentData) => {
          const transformedData = packageData.map((item) => ({
            month: getMonthLabel(item.month),
            packageCount: item.totalCollectedCount,
            shipmentCount: 0 // Initialize shipment count to 0
          }));

          shipmentData.forEach((item) => {
            const monthLabel = getMonthLabel(item.month);
            const dataEntry = transformedData.find(data => data.month === monthLabel);
            if (dataEntry) {
              dataEntry.shipmentCount = item.totalShipments;
            }
          });

          return transformedData;
        };
        const valueFormatter = (value) => `${value} units`;
        const dataset = transformDataForBarChart(reportData.totalPackageCountByMonth, reportData.shipmentCountByMonth);

        return <Box component="div" sx={{ width: '1000px', p: '2rem', border: '1px black solid', borderRadius: '10px', mb: '2rem' }}>
          <Box component="h1" sx={{ textAlign: 'center', marginBottom: '3rem' }}>PACKAGE REPORT - {selectedYear} YEAR</Box>
          <Box component='div' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box component='div'>
              <Box component="h3" sx={{}}>Total package count of the year: {reportData.totalPackageCount}</Box>
              <Box component="h3" sx={{}}>Heighest package month: {getMonthLabel(reportData.highestAndLowestPackageCount.highest.month)}</Box>
              <Box component="h3" sx={{}}>Heighest package count: {reportData.highestAndLowestPackageCount.highest.totalCollectedCount}</Box>
              <Box component="h3" sx={{}}>Lowest package month: {getMonthLabel(reportData.highestAndLowestPackageCount.lowest.month)}</Box>
              <Box component="h3" sx={{}}>Lowest package count: {reportData.highestAndLowestPackageCount.lowest.totalCollectedCount}</Box>
            </Box>
            <Box component='div'>
              <Box component="h3" sx={{}}>Total Shipment count of the year {reportData.totalShipmentsByYear}</Box>
              <Box component="h3" sx={{}}>Heighest Shipment month: {getMonthLabel(reportData.highestAndLowestShipmentCount.highest.month)}</Box>
              <Box component="h3" sx={{}}>Heighest Shipment count: {reportData.highestAndLowestShipmentCount.highest.totalShipments}</Box>
              <Box component="h3" sx={{}}>Lowest Shipment month: {getMonthLabel(reportData.highestAndLowestShipmentCount.lowest.month)}</Box>
              <Box component="h3" sx={{}}>Lowest Shipment count: {reportData.highestAndLowestShipmentCount.lowest.totalShipments}</Box>

            </Box>
          </Box>

          {/* Bar Chart */}
          <Box component="div" sx={{ margin: 'auto', width: '600px' }}>
            <BarChart
              sx={{ margin: '20px', width: '600px' }}
              dataset={dataset}
              yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
              series={[{ dataKey: 'packageCount', label: 'Package Count', valueFormatter }, { dataKey: 'shipmentCount', label: 'Shipment Count', valueFormatter }]}
              layout="horizontal"
              grid={{ vertical: true }}
              {...chartSetting}
            />
          </Box>

          {/* main table */}
          <table style={{ borderCollapse: 'collapse', width: '600px', margin: 'auto', }}>
            <thead>
              <tr>
                <th style={{ ...tableCell, minWidth: '200px' }}>Month</th>
                <th style={{ ...tableCell, minWidth: '200px' }}>Package Count</th>
                <th style={{ ...tableCell, minWidth: '200px' }}>Shipment Count</th>
              </tr>
            </thead>
            <tbody>
              {dataset.length > 0 ? (
                dataset.map((report, index) => (
                  <tr key={index}>
                    <td style={tableCell}>{report.month}</td>
                    <td style={tableCell}>{report.packageCount}</td>
                    <td style={tableCell}>{report.shipmentCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={{ ...tableCell, textAlign: 'center', padding: '1rem', fontWeight: '900' }} colSpan="4">No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      };
      default:
        return <Box component="h2">Invalid report type</Box>;
    }
  };
  return (
    <>
      <Box component="div">
        <Box component="div" sx={{ display: 'flex', flexDirection: 'row', width: '800px', margin: '0 auto', alignItems: 'center' }}>

          {/* Report type dropdown */}
          <FormControl sx={{ width: '230px', mr: '10px' }} margin="normal">
            <InputLabel>Report type</InputLabel>
            <Select value={reportType} onChange={handleTypeChange} size='small'>
              <MenuItem key='0' value='income-y'>Income Report - Year</MenuItem>
              <MenuItem key='1' value='income-m'>Income Report - Month</MenuItem>
              <MenuItem key='2' value='package-y'>Package Report - Year</MenuItem>
            </Select>
          </FormControl>

          {/* year dropdown */}
          <FormControl sx={{ width: '140px', mr: '10px' }} margin="normal">
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} onChange={handleYearChange} size='small'>
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* month dropdown */}
          <FormControl sx={{ width: '140px' }} margin="normal">
            <InputLabel>Month</InputLabel>
            <Select value={selectedMonth} onChange={handleMonthChange} size='small' disabled={disableControls}>
              {filteredMonths.map(month => (
                <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained"
            onClick={buttonClick}
            sx={{ backgroundColor: '#68DD62', height: '2.5rem', mt: '6px', ml: '15px' }}>
            Generate
          </Button>
        </Box>
      </Box>
      {loading ? '' :
        <>
          {/*Print btn*/}
          <ReactToPrint
            trigger={() => (
              <Button
                component="label"
                variant="contained"
                startIcon={<PrintIcon />}
                sx={{ position:'fixed', right:'50px',top:'95px'  }}
              >
                Print / Download
              </Button>
            )}
            content={() => componentRef.current}
            fileName="Report.pdf" // Set the default save name here
          />
          <Box component="div" sx={{ m: '10px 100px' }}>
              {/* REPORT */}
              <Box component="div" sx={{ mt: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
              <Box component="div" ref={componentRef} className='motech' sx={{ }}>
                {renderContent()}
              </Box>
            

          </Box>
        </Box>
        </>
      }
    </>
  )
}

export default Reports