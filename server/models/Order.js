module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        order_id: {
            type: DataTypes.STRING(12),
            primaryKey: true
        },
        order_open_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        order_close_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        supplier_loc: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        main_tracking_number: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        courier_tracking_number: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        feedback_des: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        issue_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(25),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    // Order.associate = models => {
    //     Order.hasOne(models.Payment, { foreignKey: 'order_id' });
    //     Order.hasOne(models.Price_quotation, { foreignKey: 'order_id' });
    //     Order.belongsTo(models.Shipment, { foreignKey: 'order_id' });
    // };

    return Order;
};
