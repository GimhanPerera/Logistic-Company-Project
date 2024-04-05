module.exports = (sequelize, DataTypes) => {
    const Order_Courier = sequelize.define("Order_Courier",{
        tracking_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        issue_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        }
    }, {
        timestamps: false
    });

    return Order_Courier;
};