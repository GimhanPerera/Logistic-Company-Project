const { Invoice, Order, Package, Customer,Payment,Price_quotation } = require('../models');

const getInvoiceDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        // /const customer = await Customer.findByPk(req.params.customerID);

        const order = await Order.findOne({
            attributes: ['order_id', 'customer_id', 'order_open_date'],
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
        const price_quo = await Price_quotation.findOne({
            attributes: ['shipping_method'],
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
            invoice: invoice,
            price_quo: price_quo
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

//add a payment
const addPayment = async (req, res) => {
    try {
            // Get the last invoice ID
            const lastPayment = await Payment.findOne({
                attributes: ['payment_id'],
                order: [['payment_id', 'DESC']]
            });

            // Determine the new invoice ID
            const newPaymentId = lastPayment ? parseInt(lastPayment.payment_id, 10) + 1 : 10000;

        
        const payment = await Payment.create({
            payment_id: newPaymentId,
            payment_method: req.body.payment_method,
            payment: req.body.payment,
            date_time: req.body.date_time,
            order_id: req.body.order_id,
        });
        
        res.status(200).json(payment);
    } catch (error) {
        // Handle error
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//delete a payment
const deletePayment = async (req, res) => {
    try {//paymentId
        const payment = await Payment.destroy({
            where: {
                payment_id: req.params.paymentId,
            },
        });
        
        res.status(200).json(payment);
    } catch (error) {
        // Handle error
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getInvoiceDetails,
    setInvoiceDetails,
    addPayment,
    deletePayment
}