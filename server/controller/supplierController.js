const { Supplier } = require('../models');



// Function to generate the next supplier_id
async function generateNextSupplierId() {
    try {
        // Find the last supplier_id
        const lastSupplier = await Supplier.findOne({
            order: [['supplier_id', 'DESC']],
        });

        // If no supplier exists yet, start with C001
        if (!lastSupplier) {
            return 'C001';
        }

        // Extract the numeric portion and increment by 1
        const lastId = lastSupplier.supplier_id;
        const lastNumericPart = parseInt(lastId.substring(1), 10); // Extract numeric part (e.g., '001')
        const nextNumericPart = lastNumericPart + 1;

        // Format the next supplier_id
        const nextSupplierId = `C${nextNumericPart.toString().padStart(3, '0')}`; // Pad with leading zeros

        return nextSupplierId;
    } catch (error) {
        console.error('Error generating next supplier_id:', error);
        throw error;
    }
}

// get all suppliers
const getAllSuppliers = async (req, res) => {
    try{
    const supplier = await Supplier.findAll({}) //{} : pass empty obj
    res.status(200).json(supplier);
} catch (error) {
    console.error('Error generating next supplier_id:', error);
    throw error;
}
}

// get all suppliers for add packages
const getAllSuppliersForAddPackage = async (req, res) => {
    try{
    const supplier = await Supplier.findAll({}) //{} : pass empty obj
    const ww = supplier.map(item => `${item.supplier_id}-${item.name}`)
    res.status(200).json(ww)
} catch (error) {
    console.error('Error generating next supplier_id:', error);
    throw error;
}
}

//add new supplier
const addSupplier = async (req, res) => {
    try{
    const newID = await generateNextSupplierId();
    
    const newSupplier = await Supplier.create({
        "supplier_id": newID,
        "name": req.body.name,
        "country": req.body.country,
        "tel_number": req.body.tel,
    })
    //console.log("OK: "+req.body.name)
    //await Supplier.create(newSupplier);

    res.status(200).json({"new_supplier": `${newID}-${req.body.name}`});
} catch (error) {
    console.error('Error generating next supplier_id:', error);
    throw error;
}
}

module.exports = {
    getAllSuppliers,
    getAllSuppliersForAddPackage,
    addSupplier
}