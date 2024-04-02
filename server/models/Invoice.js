module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define("Invoice", {
        invoice_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },{
        timestamps: false
    });

    return Invoice;
};
