const { Payment, Order, Price_quotation } = require('../models');
const { Op, fn, col } = require('sequelize');

const getMonthlyIncome = async (currentYear) => {
    const paymentResults = await Payment.findAll({
        attributes: [
            [fn('MONTH', col('date_time')), 'month'],
            [fn('SUM', col('payment')), 'totalIncome']
        ],
        where: {
            date_time: {
                [Op.gte]: new Date(`${currentYear}-01-01`),
                [Op.lt]: new Date(`${currentYear + 1}-01-01`)
            }
        },
        group: [fn('MONTH', col('date_time'))],
        order: [[fn('MONTH', col('date_time')), 'ASC']]
    });

    const monthlyIncome = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        totalIncome: 0
    }));

    paymentResults.forEach(result => {
        const month = result.getDataValue('month');
        const totalIncome = parseFloat(result.getDataValue('totalIncome'));
        monthlyIncome[month - 1].totalIncome = totalIncome;
    });

    return monthlyIncome;
};

const getMonthlyOrders = async (currentYear) => {
    const orderResults = await Order.findAll({
        attributes: [
            [fn('MONTH', col('order_open_date')), 'month'],
            [fn('COUNT', col('order_id')), 'totalOrders']
        ],
        where: {
            order_open_date: {
                [Op.gte]: new Date(`${currentYear}-01-01`),
                [Op.lt]: new Date(`${currentYear + 1}-01-01`)
            }
        },
        group: [fn('MONTH', col('order_open_date'))],
        order: [[fn('MONTH', col('order_open_date')), 'ASC']]
    });

    const monthlyOrders = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        totalOrders: 0
    }));

    orderResults.forEach(result => {
        const month = result.getDataValue('month');
        const totalOrders = parseInt(result.getDataValue('totalOrders'), 10);
        monthlyOrders[month - 1].totalOrders = totalOrders;
    });

    return monthlyOrders;
};

const getMostIncomeMonth = async () => {
    const currentYear = new Date().getFullYear();
    const monthlyIncome = await getMonthlyIncome(currentYear);

    let mostIncomeMonth = monthlyIncome[0];
    monthlyIncome.forEach(monthData => {
        if (monthData.totalIncome > mostIncomeMonth.totalIncome) {
            mostIncomeMonth = monthData;
        }
    });

    return mostIncomeMonth;
};

const getLeastIncomeMonth = async () => {
    const currentYear = new Date().getFullYear();
    const monthlyIncome = await getMonthlyIncome(currentYear);

    let leastIncomeMonth = monthlyIncome[0];
    monthlyIncome.forEach(monthData => {
        if (monthData.totalIncome < leastIncomeMonth.totalIncome) {
            leastIncomeMonth = monthData;
        }
    });

    return leastIncomeMonth;
};

// Function to get the total income of the current year
const getTotalIncomeOfYear = async (currentYear) => {
    const paymentResults = await Payment.findAll({
        attributes: [
            [fn('SUM', col('payment')), 'totalIncome']
        ],
        where: {
            date_time: {
                [Op.gte]: new Date(`${currentYear}-01-01`),
                [Op.lt]: new Date(`${currentYear + 1}-01-01`)
            }
        }
    });

    return paymentResults[0].getDataValue('totalIncome') || 0;
};

// Function to get the total price quotations of the current year
const getTotalPriceQuotationsOfYear = async (currentYear) => {
    const quotationResults = await Price_quotation.findAll({
        attributes: [
            [fn('SUM', col('quotation')), 'totalQuotations']
        ],
        include: [{
            model: Order,
            attributes: [],
            where: {
                order_open_date: {
                    [Op.gte]: new Date(`${currentYear}-01-01`),
                    [Op.lt]: new Date(`${currentYear + 1}-01-01`)
                }
            }
        }],
        group: ['Price_quotation.quotation_id'] // Group by primary key of Price_quotation
    });
    let total = 0;
    const setTotal = quotationResults.map((quotation, index)=>{
        console.log("quotationResults ",quotation.dataValues.totalQuotations)
        total += parseInt(quotation.dataValues.totalQuotations, 10);
    })
    console.log("Total ",total)
    //console.log("quotationResults ",quotationResults)

    return total || 0;
};


const getReportData = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        console.log("currentYear: ", currentYear);
        const monthlyIncome = await getMonthlyIncome(currentYear);
        const monthlyOrders = await getMonthlyOrders(currentYear);
        const mostIncome = await getMostIncomeMonth();
        const lessIncome = await getLeastIncomeMonth();
        const totalIncomeOfYear = await getTotalIncomeOfYear(currentYear);
        const totalPriceQuotationsOfYear = await getTotalPriceQuotationsOfYear(currentYear);

        const combinedReport = monthlyIncome.map((incomeData, index) => ({
            month: incomeData.month,
            totalIncome: incomeData.totalIncome,
            totalOrders: monthlyOrders[index].totalOrders
        }));

        res.status(200).json({
            combinedReport,
            mostIncome,
            lessIncome,
            totalIncomeOfYear,
            totalPriceQuotationsOfYear
        });

    } catch (error) {
        console.error('Error calculating report data:', error);
        res.status(500).json({ error: 'An error occurred while generating the report' });
    }
}

module.exports = {
    getReportData,
    getMostIncomeMonth,
    getLeastIncomeMonth,
    getTotalIncomeOfYear,
    getTotalPriceQuotationsOfYear
};
