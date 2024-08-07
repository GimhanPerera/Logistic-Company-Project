const express = require('express');
const app = express();
const cors = require("cors");

const db = require('./models');
app.use(express.json());
app.use(cors());

//Routers: for apply routes

// http://localhost:3001/api/customers Endpoint
const customerRouter = require('./routes/customersRouter');
app.use("/api/customers",customerRouter);

const courierRouter = require('./routes/courierRouter');
app.use("/api/courier",courierRouter);

const orderRouter = require('./routes/orderRouter');
app.use("/api/order",orderRouter);

const loginRouter = require('./routes/loginRouter');
app.use("/api/login",loginRouter);

const shipmentRouter = require('./routes/shipmentRouter');
app.use("/api/shipment",shipmentRouter);

const complainsRouter = require('./routes/complainsRouter');
app.use("/api/complain",complainsRouter);

const feedbackRouter = require('./routes/feedbackRouter');
app.use("/api/feedback",feedbackRouter);

const supplierRouter = require('./routes/supplierRouter');
app.use("/api/supplier",supplierRouter);

const packageRouter = require('./routes/packageRouter');
app.use("/api/package",packageRouter);

const priceQuotationRouter = require('./routes/priceQuotationRouter');
app.use("/api/priceQuotationRouter",priceQuotationRouter);

const invoice = require('./routes/invoiceRouter');
app.use("/api/invoice",invoice);

const noticesRouter = require('./routes/noticesRouter');
app.use("/api/noitces",noticesRouter);

const smsRouter = require('./routes/smsRouter');
app.use("/api/sms",smsRouter);

const dashboardRouter = require('./routes/dashboardRouter');
app.use("/api/dashboard",dashboardRouter);

const reportRouter = require('./routes/reportRouter');
app.use("/api/report",reportRouter);

const employeeRouter = require('./routes/employeeRouter');
app.use("/api/employee",employeeRouter);

//server listen to 3001 port number
db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});