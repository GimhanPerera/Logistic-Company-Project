const { Supplier } = require('../models');


const getAllSuppliers = async (req, res) => {
    const supplier = await Supplier.findAll({}) //{} : pass empty obj
    res.status(200).json(supplier)
}
const getAllSuppliersForAddPackage = async (req, res) => {
    const supplier = await Supplier.findAll({}) //{} : pass empty obj
    const ww = supplier.map(item => `${item.supplier_id}-${item.name}`)
    res.status(200).json(ww)

}


module.exports = {
    getAllSuppliers,
    getAllSuppliersForAddPackage
}