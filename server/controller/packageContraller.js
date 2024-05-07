const { Package } = require('../models');



//Add packages
const addPackages = async (req, res) => {
    const allPackages = req.body;
    let addableAllPackages = [];
    allPackages.forEach(package => {
        const oID =package.smark.substring(0, 12);
        console.log(oID)
        addableAllPackages.push({
            "shipping_mark":package.smark,
            "items":package.details.items,
            //"package_count":package.details.package_count,
            "status":'not received',
            "local_tracking_number":package.details.local_tracking_number,//not collected
            "length":package.details.length,
            "height":package.details.height,
            "width":package.details.width,
            "weight":package.details.weight,
            "volume_metric_weight":package.details.volume_metric_weight,
            "gross_weight":package.details.gross_weight,
            "chargable_weight":package.details.chargable_weight,
            "order_id":package.smark.substring(0, 12),
            "supplier_id":package.details.supplier.substring(0, 4),
            //warehouse_tracking_number,collected_date_time,rate,tax,total: Not in this stage
            
        })
        console.log(package.smark)
        console.log(package.details.items)
    })
    await Package.bulkCreate(addableAllPackages);
    // Send success response
    res.status(200).json({ message: 'Packages added successfully.' });
}

module.exports = {
    addPackages
}