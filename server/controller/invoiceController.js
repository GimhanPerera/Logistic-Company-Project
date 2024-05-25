const { Invoice, Order, Package, Customer } = require('../models');



//1. Add a customer
const addCourier = async (req, res) => {
    const courier = req.body;
    await Courier.create(courier);
    res.status(200).json(courier)
}

const getInvoiceDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        // /const customer = await Customer.findByPk(req.params.customerID);

        const order = await Order.findOne({
            attributes: ['order_id', 'customer_id', 'order_open_date']
        }, {
            where: { order_id: orderId }
        });
        const customer = await Customer.findByPk(order.customer_id, {
            attributes: ['customer_id', 'f_name', 'l_name', 'tel_number', 'address']
        });

        const packages = await Package.findAll({
            where: { order_id: orderId }
        });
        const invoice = await Invoice.findOne({
            where: { order_id: orderId }
        });

        if (!invoice) {
            // Get the last invoice ID
            const lastInvoice = await Invoice.findOne({
                attributes: ['invoice_id'],
                order: [['invoice_id', 'DESC']]
            });

            // Determine the new invoice ID
            const newInvoiceId = lastInvoice ? lastInvoice.invoice_id + 1 : 10000;

            // Create a new invoice
            invoice = await Invoice.create({
                invoice_id: newInvoiceId,
                discount: 0.00, // Or any default value
                total: 0.00, // Or any default value
                order_id: orderId,
            });

        }

        const respond = {
            order: order,
            customer: customer,
            packages: packages,
            invoice: invoice
        }
        res.status(200).json(respond)
    } catch (error) {
        // Handle error
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//Set the invoice updates
const setInvoiceDetails = async (req, res) => {
    try {

        await Invoice.update({
            discount: req.body.invoice.discount,
            total: req.body.invoice.total,
        }, {
            where: { invoice_id: req.body.invoice.invoice_id }
        }
        );

        const packageUpdatePromises = req.body.packages.map(packageDetails => {

            return Package.update({
                chargable_weight: packageDetails.chargable_weight,
                rate: packageDetails.rate,
                tax: packageDetails.tax,
                total: packageDetails.total,
            }, {
                where: { shipping_mark: packageDetails.shipping_mark }
            });
        });

        await Promise.all(packageUpdatePromises);


        res.status(200).json("Success")
    } catch (error) {
        // Handle error
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getInvoiceDetails,
    setInvoiceDetails
}