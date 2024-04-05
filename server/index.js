const express = require('express');
const app = express();
const cors = require("cors");

const db = require('./models');
app.use(express.json());
app.use(cors());

//Routers: for apply routes
// http://localhost:3001/posts Ekata ena ewa okkoma mekata yanne
const postRouter = require('./routes/Posts');
app.use("/posts",postRouter);

// http://localhost:3001/customers Ekata ena ewa okkoma mekata yanne
const customerRouter = require('./routes/Customers');
app.use("/customers",customerRouter);

const courierRouter = require('./routes/Courier');
app.use("/courier",courierRouter);


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});