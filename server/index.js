const express = require('express');
const app = express();
const cors = require("cors");

const db = require('./models');
app.use(express.json());
app.use(cors());

//Routers: for apply routes

// http://localhost:3001/customers Ekata ena ewa okkoma mekata yanne
const customerRouter = require('./routes/customersRouter');
app.use("/customers",customerRouter);

const courierRouter = require('./routes/courierRouter');
app.use("/courier",courierRouter);

const orderRouter = require('./routes/orderRouter');
app.use("/order",orderRouter);

const loginRouter = require('./routes/loginRouter');
app.use("/login",loginRouter);

const shipmentRouter = require('./routes/shipmentRouter');
app.use("/shipment",shipmentRouter);

const complainsRouter = require('./routes/complainsRouter');
app.use("/complain",complainsRouter);

const feedbackRouter = require('./routes/feedbackRouter');
app.use("/feedback",feedbackRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});