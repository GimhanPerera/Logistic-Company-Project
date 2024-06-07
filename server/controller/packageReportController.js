const { Payment, Order, Price_quotation, Shipment, Package } = require('../models');
const { Op, fn, col } = require('sequelize');

const getTotalPackageCount = async (year) => {
    try {
        const startOfMonth = new Date(year, 0, 1);
        const endOfMonth = new Date(year, 11, 0, 23, 59, 59); // Last day of the month

        const totalPackageCount = await Package.findAll({
            attributes: [
                [fn('SUM', col('collected_count')), 'totalCollectedCount']
            ],
            where: {
                collected_date_time: {
                    [Op.gte]: startOfMonth,
                    [Op.lt]: endOfMonth
                }
            }
        });
        

        // Extract the totalCollectedCount from the result
        const totalCollectedCount = totalPackageCount[0].getDataValue('totalCollectedCount');
        
        return totalCollectedCount;
    } catch (error) {
        console.error('Error fetching total package count:', error);
        throw error;
    }
};

const getTotalPackageCountByMonth = async (year) => {
    try {
        const startOfYear = new Date(`${year}-01-01`);
        const endOfYear = new Date(`${year + 1}-01-01`);

        const packageCounts = await Package.findAll({
            attributes: [
                [fn('MONTH', col('collected_date_time')), 'month'],
                [fn('SUM', col('collected_count')), 'totalCollectedCount']
            ],
            where: {
                collected_date_time: {
                    [Op.gte]: startOfYear,
                    [Op.lt]: endOfYear
                }
            },
            group: [fn('MONTH', col('collected_date_time'))],
            order: [[fn('MONTH', col('collected_date_time')), 'ASC']]
        });

        // Initialize an array with 12 months, defaulting totalCollectedCount to 0
        const monthlyPackageCounts = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            totalCollectedCount: 0
        }));

        // Populate the array with the results from the query
        packageCounts.forEach(result => {
            const month = result.getDataValue('month');
            const totalCollectedCount = parseFloat(result.getDataValue('totalCollectedCount'));
            monthlyPackageCounts[month - 1].totalCollectedCount = totalCollectedCount;
        });

        return monthlyPackageCounts;
    } catch (error) {
        console.error('Error fetching total package count by month:', error);
        throw error;
    }
};

const getTotalShipmentsByYear = async (year) => {
    try {
        // Ensure the year is an integer
        year = parseInt(year, 10);

        if (isNaN(year)) {
            throw new Error('Invalid year parameter');
        }

        const startOfYear = new Date(`${year}-01-01`);
        const endOfYear = new Date(`${year}-12-31`);

        const totalShipments = await Shipment.count({
            where: {
                arrival_date: {
                    [Op.gte]: startOfYear,
                    [Op.lte]: endOfYear
                }
            }
        });

        return totalShipments;
    } catch (error) {
        console.error('Error fetching total shipments by year:', error);
        throw error;
    }
};

const getShipmentCountByMonth = async (year) => {
    try {
        // Ensure the year is an integer
        year = parseInt(year, 10);

        if (isNaN(year)) {
            throw new Error('Invalid year parameter');
        }

        const startOfYear = new Date(`${year}-01-01`);
        const endOfYear = new Date(`${year}-12-31`);

        const shipmentCounts = await Shipment.findAll({
            attributes: [
                [fn('MONTH', col('arrival_date')), 'month'],
                [fn('COUNT', col('BL_no')), 'totalShipments']
            ],
            where: {
                arrival_date: {
                    [Op.gte]: startOfYear,
                    [Op.lte]: endOfYear
                }
            },
            group: [fn('MONTH', col('arrival_date'))],
            order: [[fn('MONTH', col('arrival_date')), 'ASC']]
        });

        // Initialize an array with 12 months, defaulting totalShipments to 0
        const monthlyShipmentCounts = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            totalShipments: 0
        }));

        // Populate the array with the results from the query
        shipmentCounts.forEach(result => {
            const month = result.getDataValue('month');
            const totalShipments = parseInt(result.getDataValue('totalShipments'), 10);
            monthlyShipmentCounts[month - 1].totalShipments = totalShipments;
        });

        return monthlyShipmentCounts;
    } catch (error) {
        console.error('Error fetching shipment count by month:', error);
        throw error;
    }
};

const findHighestAndLowestPackageCount = (totalPackageCountByMonth) => {
    if (!totalPackageCountByMonth || totalPackageCountByMonth.length === 0) {
        return {
            highest: null,
            lowest: null
        };
    }

    let highest = totalPackageCountByMonth[0];
    let lowest = totalPackageCountByMonth[0];
    

    totalPackageCountByMonth.forEach(monthData => {
        if (monthData.totalCollectedCount > highest.totalCollectedCount) {
            highest = monthData;
        }
        if (monthData.totalCollectedCount < lowest.totalCollectedCount) {
            lowest = monthData;
        }
    });

    return {
        highest,
        lowest
    };
};

const findHighestAndLowestShipmentCount = (shipmentCountByMonth) => {
    if (!shipmentCountByMonth || shipmentCountByMonth.length === 0) {
        return {
            highest: null,
            lowest: null
        };
    }

    let highest = shipmentCountByMonth[0];
    let lowest = shipmentCountByMonth[0];
    

    shipmentCountByMonth.forEach(monthData => {
        if (monthData.totalShipments > highest.totalShipments) {
            highest = monthData;
        }
        if (monthData.totalShipments < lowest.totalShipments) {
            lowest = monthData;
        }
    });

    return {
        highest,
        lowest
    };
};

const getYearReport = async (req, res) => {
    try {
        let  { year} = req.query;
        const totalPackageCount = await getTotalPackageCount(year);
        const totalPackageCountByMonth = await getTotalPackageCountByMonth( parseInt(year, 10));
        const totalShipmentsByYear = await getTotalShipmentsByYear(year);
        const shipmentCountByMonth = await getShipmentCountByMonth(year);
        const highestAndLowestPackageCount = await findHighestAndLowestPackageCount(totalPackageCountByMonth);
        const highestAndLowestShipmentCount = await findHighestAndLowestShipmentCount(shipmentCountByMonth);

        res.status(200).json({
            totalPackageCount,
            totalPackageCountByMonth,
            totalShipmentsByYear,
            shipmentCountByMonth,
            highestAndLowestPackageCount,
            highestAndLowestShipmentCount
        });

    } catch (error) {
        console.error('Error calculating report data:', error);
        res.status(500).json({ error: 'An error occurred while generating the report' });
    }
}

module.exports = {
    getYearReport,
};