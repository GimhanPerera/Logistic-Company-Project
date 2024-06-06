import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';

const Reports = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [reportType, setReportType] = useState('income-y');
  const [loading, setLoading] = useState(true);
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
    setSelectedYear(event.target.value);
    // Reset month if the selected year changes
    if (event.target.value === currentYear && selectedMonth > currentMonth) {
      setSelectedMonth('');
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleTypeChange = (event) => {
    setReportType(event.target.value);
  };
  const getMonthLabel = (monthValue) => {
    const month = months.find(m => m.value === monthValue);
    return month ? month.label : 'Unknown';
  }

  //------------------------------------------------------

  useEffect(() => {

  }, []);

  const buttonClick = () => {
    const month = 5;
    //axios.get(`http://localhost:3001/api/report/income/yearReport?year=${year}&month=${month}`)
    axios.get(`http://localhost:3001/api/report/income/yearReport?year=${selectedYear}`)
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
              <MenuItem key='3' value='package-m'>Package Report - Month</MenuItem>
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
            <Select value={selectedMonth} onChange={handleMonthChange} size='small'>
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
          {/* REPORT */}
          <Box component="div" sx={{ mt: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <Box component="div" sx={{ width: '1000px', p: '2rem', border: '1px black solid', borderRadius: '10px' }}>
            <Box component="h3" sx={{ textAlign: 'center' }}>Income Report - 2024 Year</Box>
              <Box component="h3" sx={{ textAlign: 'center' }}>Most Income month: {getMonthLabel(reportData.mostIncome.month)}</Box>
              <Box component="h3" sx={{ textAlign: 'center', mb: '1rem' }}>Income: {reportData.mostIncome.totalIncome}</Box>

              <Box component="h3" sx={{ textAlign: 'center' }}>Less Income month: {getMonthLabel(reportData.lessIncome.month)}</Box>
              <Box component="h3" sx={{ textAlign: 'center', mb: '1rem' }}>Income: {reportData.lessIncome.totalIncome}</Box>

              <Box component="h3" sx={{ textAlign: 'center' }}>Total income of the Year: {reportData.totalIncomeOfYear}</Box>
              <Box component="h3" sx={{ textAlign: 'center', mb: '1rem' }}>Total quotation total of the Year: {reportData.totalPriceQuotationsOfYear}</Box>

              <Box component="div" sx={{ mb: '1rem', display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                <Box component="div">
                  <Box component="p" >CREATIVE FREIGHTWAY LOGISTIC(PVT)LTD<br />No25A/2,<br />Thoranawila Junction,<br />Makandana,<br />Piliyandala.<br />94712055774</Box>
                  <br />

                </Box>
              </Box>

              {/* main table */}
              <table style={{ borderCollapse: 'collapse' }}>
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

            </Box>
          </Box>
        </>
      }
    </>
  )
}

export default Reports