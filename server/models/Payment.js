module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
        payment_id: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        payment_method: {
            type: DataTypes.STRING(10),
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

    return Payment;
};
