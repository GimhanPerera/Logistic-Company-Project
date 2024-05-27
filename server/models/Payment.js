module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
        payment_id: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        payment_method: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        payment: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        date_time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    // Payment.associate = models => {
    //     Payment.belongsTo(models.Order, { foreignKey: 'order_id' });
    // };

    return Payment;
};
