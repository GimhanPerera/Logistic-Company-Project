const { Payment, Shipment, Order,Price_quotation,Complain,Customer,Employee } = require('../models');
const { getCurrentSriLankanDate, getCurrentSriLankanDateTime, getCurrentSriLankanTime } = require('../middleware/dateTime');
const { Op, fn, col, literal } = require('sequelize');
//const orderCount = await Order.count({ where: { customer_id: customer.customer_id, status: { [Op.ne]: 'FINISH' } } });

// const customer = await Customer.findAll({
//     include: [{
//         model: Order
//     }],
//     where: {customer_id: 'CFL610'}
// });

//get dashboard data
const getDashboardData = async (req, res) => {
    const currentYear = new Date().getFullYear();
    const startOfMonth = new Date(new Date().setDate(1));
    const endOfMonth = new Date(new Date().setMonth(new Date().getMonth() + 1, 0));

    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

    // Generate all months of the current year
    const allMonths = Array.from({ length: 12 }, (_, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        return `${currentYear}-${month}`;
    });

    try {
        const totalIncomeThisMonth = await Payment.sum('payment', {
            where: {
                date_time: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });
        const totalIncomeThisYear = await Payment.sum('payment', {
            where: {
                date_time: {
                    [Op.between]: [startOfYear, endOfYear]
                }
            }
        });
        const activeShipmentsCount = await Shipment.count({
            where: {
                status: {
                    [Op.ne]: 'completed' // 'ne' means 'not equal'
                }
            }
        });
        const activeOrderCount = await Order.count({
            where: {
                status: {
                    [Op.notIn]: ['FINISH', 'Request']  // 'notIn' to exclude multiple values
                }
            }
        });
        const PriceRequestCount = await Price_quotation.count({
            where: {
                status: {
                    [Op.eq]: ['Request']  // 'eq' is =
                }
            }
        });

        //This year monthly income-----------------------------------------------------------------------------
        const monthlyIncome = await Payment.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('date_time'), '%Y-%m'), 'month'], // Format the date to Year-Month
                [fn('SUM', col('payment')), 'totalIncome'] // Sum the payment amounts
            ],
            where: {
                date_time: {
                    [Op.between]: [startOfYear, endOfYear] // Filter payments for the current year
                }
            },
            group: [literal('month')], // Group by the formatted date
            order: [literal('month')] // Order by month
        });

        // Map the results to a more readable format
        const monthlyIncomeMap = monthlyIncome.reduce((acc, item) => {
            acc[item.get('month')] = parseFloat(item.get('totalIncome'));
            return acc;
        }, {});

        // Combine all months with the query results, filling missing months with 0 income
        const monthlyIncomeForChat = allMonths.map(month => ({
            month,
            totalIncome: monthlyIncomeMap[month] || 0
        }));

        //Order counts of this year based on category-------------------------------------------------------------------------
        const orderCounts = await Order.findAll({
            attributes: [
                'category', // Group by category
                [fn('COUNT', col('order_id')), 'orderCount'] // Count the orders
            ],
            where: {
                order_open_date: {
                    [Op.between]: [startOfYear, endOfYear] // Filter orders for the current year
                },
                category: {
                    [Op.in]: ['G', 'DG', 'DG-B'] // Include only specific categories
                }
            },
            group: ['category'], // Group by category
            order: ['category'] // Order by category
        });
        // Map the results to a more readable format
        const orderCountforEachCategory = orderCounts.map(item => ({
            category: item.get('category'),
            orderCount: parseInt(item.get('orderCount'), 10)
        }));

        const totalPendingComplains = await Complain.count({
            where: {
                status: 'pending'
            }
        });
        //Total customer count
        const totalCustomerCount = await Customer.count();
        //Status vise customer counts
        const statusViseCustomerCounts = await Customer.findAll({
            attributes: [
                'status',
                [fn('COUNT', col('status')), 'count']
            ],
            group: 'status'
        });
        //Total customer count
        const totalEmpCount = await Employee.count();
        //Status vise customer counts
        const statusViseEmpCounts = await Employee.findAll({
            attributes: [
                'status',
                [fn('COUNT', col('status')), 'count']
            ],
            group: 'status'
        });

        //return { totalMonth, totalYear };
        //const customer = await Customer.findByPk(id) //ID eken one nan
        //const courier = await Courier.findAll({}) //{} : pass empty obj

        const respond = {
            totalIncomeThisMonth: totalIncomeThisMonth == null ? 0 : totalIncomeThisMonth,
            totalIncomeThisYear: totalIncomeThisYear == null ? 0 : totalIncomeThisYear,
            activeShipmentsCount,
            activeOrderCount,
            PriceRequestCount,
            monthlyIncomeForChat,
            orderCountforEachCategory,
            //
            totalPendingComplains,
            totalCustomerCount,
            statusViseCustomerCounts,
            totalEmpCount,
            statusViseEmpCounts
        }

        res.status(200).json(respond)

    } catch (error) {
        console.error('Error calculating total payments:', error);
    }

}


module.exports = {
    getDashboardData,
}