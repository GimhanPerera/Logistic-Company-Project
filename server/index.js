const express = require('express');
const app = express();
const cors = require("cors");

const db = require('./models');
app.use(express.json());
app.use(cors());

//Routers: for apply routes

// http://localhost:3001/customers Ekata ena ewa okkoma mekata yanne
const customerRouter = require('./routes/Customers');
app.use("/customers",customerRouter);

const courierRouter = require('./routes/Courier');
app.use("/courier",courierRouter);

const orderRouter = require('./routes/Order');
app.use("/order",orderRouter);

const loginRouter = require('./routes/Login');
app.use("/login",loginRouter);

const shipmentRouter = require('./routes/Shipment');
app.use("/shipment",shipmentRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});