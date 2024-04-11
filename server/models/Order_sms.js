module.exports = (sequelize, DataTypes) => {
    const Order_sms = sequelize.define("Order_sms",{
        order_id: {
            type: DataTypes.STRING(12),
            primaryKey: true
        },
        sms_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    }, {
        timestamps: false
    });

    return Order_sms;
};