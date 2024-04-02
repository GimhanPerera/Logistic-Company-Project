const Payment = require("./Payment");

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        order_id: {
            type: DataTypes.STRING(11),
            primaryKey: true
        },
        order_open_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        order_close_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        supplier_loc: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        main_tracking_number: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        feedback_des: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        issue_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(15),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Order;
};
