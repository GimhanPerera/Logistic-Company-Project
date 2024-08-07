const { Shipment, Order, Package } = require('../models');
const { sendNormalSMS } = require('../middleware/smsGateway');


// Add a shipment
const addShipment = async (req, res) => {
    try {
        const shipment = [{
            BL_no: req.body.BLnumber,
            category: req.body.category,
            shipping_method: req.body.shippingMethod,
            loaded_date: new Date(req.body.loadedDate), // Convert to Date object
            arrival_date: new Date(req.body.arrivalDate), // Convert to Date object
            displayed_arrival_date: new Date(req.body.displayDate) // Convert to Date object
        }];

        console.log(req.body.displayDate);
        await Shipment.create(shipment[0]); //need to check duplications

        // Update orders concurrently
        const orderUpdatePromises = req.body.orderIds.map(orderId => {
            console.log(orderId);
            return Order.update({
                BL_no: req.body.BLnumber,
                status: 'Ship/airfreight',
            }, {
                where: { order_id: orderId }
            });
        });

        await Promise.all(orderUpdatePromises);

        res.status(200).json(shipment);
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Get all Shipment details
const getAllShipments = async (req, res) => {
    try {
        //const customer = await Customer.findByPk(id) //ID eken one nan
        const shipment = await Shipment.findAll({
            include: [{
                model: Order,
                attributes: ['order_id']
            }]
        }) //{} : pass empty obj
        res.status(200).json(shipment);
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// get all packages from shipment
const getPackagesOfAShipment = async (req, res) => {
    try {
        console.log("Connected")
        // Retrieve order IDs that match the BL_no
        const orders = await Order.findAll({
            attributes: ['order_id'],
            where: {
                BL_no: req.params.BLnumber,
            },
        });

        // Extract order IDs from the result
        const orderIDs = orders.map(order => order.order_id);

        // Retrieve shipping marks for the retrieved order IDs
        const packages = await Package.findAll({
            attributes: ['shipping_mark', 'package_count', 'collected_count'],
            where: {
                order_id: orderIDs,
            },
        });

        // Initialize totals
        let totalPackageCount = 0;
        let totalCollectedCount = 0;

        // Helper function to generate display_mark
        // const generateDisplayMark = (shipping_mark) => {
        //     const parts = shipping_mark.split(" ");
        //     const range = parts[1].split("-");
        //     const start = parseInt(range[0], 10);
        //     const end = parseInt(range[1], 10);

        //     if (start === end) {
        //         return `${parts[0]} ${start}`;
        //     } else {
        //         return `${parts[0]} ${start} to ${end}`;
        //     }
        // };

        // Process packages and compute totals
        const processedPackages = packages.map(pkg => {
            const collectedCount = pkg.collected_count !== null ? pkg.collected_count : 0;
            totalPackageCount += pkg.package_count;
            totalCollectedCount += collectedCount;

            //const displayMark = generateDisplayMark(pkg.shipping_mark);

            return {
                shipping_mark: pkg.shipping_mark,
                package_count: pkg.package_count,
                collected_count: collectedCount,
                //display_mark: displayMark
            };
        });

        //console.log(orderIDs,packages)
        // Respond with processed packages and totals
        res.status(200).json({
            packages: processedPackages,
            totalPackageCount,
            totalCollectedCount
        });

    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// get current Sri Lanka date time
const getCurrentSriLankanDateTime = () => {

    const currentDate = new Date();
    //const time = currentDate.toLocaleTimeString();//This give the GMT time. Need to add 5.30hours to convert to Sri Lankan time
    currentDate.setHours(currentDate.getHours() + 5);
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    const updatedTime = currentDate.toLocaleTimeString(); //Sri lankan time

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${updatedTime}`;
    return formattedDate;
};

// save QR code scan updates
const saveScanUpdates = async (req, res) => {
    try {
        // Get the user id(Employee id) and current date and time
        const userId = req.user.sub;
        let allCompleted = true;


        const packageUpdatePromises = req.body.map(packageDetails => {
            console.log(packageDetails);
            return Package.update({
                collected_count: packageDetails.collectedCount,
                collected_date_time: getCurrentSriLankanDateTime(),
                emp_id: userId,
            }, {
                where: { shipping_mark: packageDetails.shippingMark }
            });
        });

        await Promise.all(packageUpdatePromises);

        // Calculate total package count and collected package count for each order
        const orderTotals = req.body.reduce((acc, packageDetails) => {
            const orderId = packageDetails.shippingMark.substring(0, 12); // Extract first 12 characters as order ID

            if (!acc[orderId]) {
                acc[orderId] = {
                    orderId: orderId,
                    totalPackageCount: 0,
                    totalCollectedCount: 0
                };
            }

            acc[orderId].totalPackageCount += packageDetails.count;
            acc[orderId].totalCollectedCount += packageDetails.collectedCount;

            return acc;
        }, {});

        // Update order status based on package counts
        const orderIdsToUpdate = [];
        for (const orderId in orderTotals) {
            const { totalPackageCount, totalCollectedCount } = orderTotals[orderId];
            let orderStatus = 'onhand';
            if (totalPackageCount != totalCollectedCount) {
                orderStatus = 'Ship/airfreight';
                allCompleted = false;
            }else{
                sendNormalSMS(orderId, `Order ID: ${orderId}\nYour packages have arrived in Sri Lanka\nContact Us: 0714744874`, req.user.sub);//send sms
            }

            // Update order status in the database
            await Order.update({ status: orderStatus }, { where: { order_id: orderId } });
            orderIdsToUpdate.push(orderId);
            console.log("-------------------------------");
            console.log(orderId, orderStatus); console.log("ID: ", req.user)
        }

        //Get BL_number
        const BL_no = await Order.findOne({
            attributes: ['BL_no'],
            where: { order_id: orderIdsToUpdate[0] }
        });
        console.log("ID 1: ",orderIdsToUpdate[0],BL_no)

        //Update shipment
        if (allCompleted) {
            await Shipment.update({ status: 'completed' }, { where: { BL_no: BL_no.BL_no } });
        } else {
            await Shipment.update({ status: 'waiting' }, { where: { BL_no: BL_no.BL_no } });
        }
        console.log("All completed? " + allCompleted);
        console.log("BL? ", BL_no.BL_no);


        res.status(200).json({
            message: "Success",
            orderIdsUpdated: orderIdsToUpdate
        });
    } catch (error) {
        // Handle error
        console.error("Error processing scan updates:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// edit a shipment
const editShipment = async (req, res) => {
    try {
        console.log("TEST!");
        const shipment = await Shipment.update({
            displayed_arrival_date: req.body.displayDate,
            loaded_date: req.body.loadedDate,
            arrival_date: req.body.arrivalDate,
        }, {
            where: { BL_no: req.body.BL_number }
        });
        const shipmentStatus = await Shipment.findByPk(req.body.BL_number);
        
        if(shipmentStatus.dataValues.status == 'completed'){
            console.log("Completed shipment")
            res.status(200).json(shipment);
            return
        }

        const order = await Order.update({
            BL_no: null,
            status: 'In Warehouse'
        }, {
            where: {
                BL_no: req.body.BL_number,
            },
        });
        // Update orders concurrently
        const orderUpdatePromises = req.body.orderIds.map(orderId => {
            console.log(orderId);
            return Order.update({
                BL_no: req.body.BL_number,
                status: 'Ship/airfreight',
            }, {
                where: { order_id: orderId }
            });
        });

        await Promise.all(orderUpdatePromises);
        console.log("TESTLAST ");
        res.status(200).json(shipment);
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// delete shipment
const deleteShipment = async (req, res) => {
    try {
        const BL_number = req.params.BL_number;
        console.log(req.params.orderID);
        const order = await Order.update({
            BL_no: null,
            status: 'In Warehouse'
        }, {
            where: {
                BL_no: BL_number,
            },
        });
        const shipment = await Shipment.destroy({
            where: {
                BL_no: BL_number,
            },
        });



        res.status(200).json("SUCCESS");
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// get package details from BL number
const getPackagesDetailsFromBL = async (req, res) => {
    try {
        console.log("Connected")
        // Retrieve order IDs that match the BL_no
        const orders = await Order.findAll({
            attributes: ['order_id'],
            where: {
                BL_no: req.params.BLnumber,
            },
        });

        // Extract order IDs from the result
        const orderIDs = orders.map(order => order.order_id);

        // Retrieve shipping marks for the retrieved order IDs
        const packages = await Package.findAll({
            attributes: ['shipping_mark', 'items','collected_date_time', 'emp_id'],
            where: {
                order_id: orderIDs,
            },
        });

        //console.log(orderIDs,packages)
        // Respond with processed packages and totals
        res.status(200).json(packages);

    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getAllShipments,
    addShipment,
    getPackagesOfAShipment,
    saveScanUpdates,
    editShipment,
    deleteShipment,
    getPackagesDetailsFromBL
}