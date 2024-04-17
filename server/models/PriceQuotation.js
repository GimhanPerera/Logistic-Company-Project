module.exports = (sequelize, DataTypes) => {
    const Price_quotation = sequelize.define("Price_quotation", {
        qoutation_id: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        items: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        raugh_weight: {
            type: DataTypes.DECIMAL(7, 3), //kg
            allowNull: false
        },
        shipping_method: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        no_of_packages: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        image: {
            type: DataTypes.INTEGER, //NEED TO UPDATE
            allowNull: false
        },
        performa_invoice: {
            type: DataTypes.STRING(20), //NEED TO UPDATE
            allowNull: false
        },
        quotation: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    // Price_quotation.associate = models => {
    //     Price_quotation.belongsTo(models.Order, { foreignKey: 'order_id' });
    // };

    return Price_quotation;
};
