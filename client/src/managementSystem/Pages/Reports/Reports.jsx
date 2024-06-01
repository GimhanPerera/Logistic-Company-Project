import React from 'react';

const Reports = () => {

  const [reportData, setReportData] = useState('');
  const [totalIncome, setTotalIncome] = useState([]);

  useEffect(() => {
    const year = 2024;
    const month = 5;
    axios.get(`http://localhost:3001/api/report/income?year=${year}&month=${month}`)
      .then((response) => {
        setReportData(response.data);
        //setTotalIncome(response.data.monthlyIncomeForChat.map(data => data.totalIncome));
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, []);

  return (
    <div>
      Reports
    </div>
  )
}

export default Reports