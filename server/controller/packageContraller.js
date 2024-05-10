const { Package, Order } = require('../models');



//Add packages
const addPackages = async (req, res) => {
    try {
        let orderID='';
        const allPackages = req.body;
        let addableAllPackages = [];
        allPackages.forEach(package => {
            const oID = package.smark.substring(0, 12);
            orderID =oID;
            console.log(oID)
            addableAllPackages.push({
                "shipping_mark": package.smark,
                "items": package.details.items,
                "status": 'not received',
                "local_tracking_number": package.details.local_tracking_number,//not collected
                "length": package.details.length,
                "height": package.details.height,
                "width": package.details.width,
                "weight": package.details.weight,
                "volume_metric_weight": package.details.volume_metric_weight,
                "gross_weight": package.details.gross_weight,
                "chargable_weight": package.details.chargable_weight,
                "order_id": package.smark.substring(0, 12),
                "supplier_id": package.details.supplier.substring(0, 4),
                //warehouse_tracking_number,collected_date_time,rate,tax,total: Not in this stage

            })
            console.log(package.smark)
            console.log(package.details.items)
        })
        await Package.bulkCreate(addableAllPackages);

        await Order.update(
            { status: "Waiting" },
            { where: { order_id: orderID } }
        );
        console.log("MARK")
console.log(allPackages[0].smark.substring(0, 12))
        // Send success response
        res.status(200).json({ message: 'Packages added successfully.' });
    } catch (error) {
        // Handle errors
        console.error('Error adding packages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    addPackages
}