module.exports = (sequelize, DataTypes) => {
    const Supplier = sequelize.define("Supplier", {
        supplier_id: {
            type: DataTypes.STRING(5),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        tel_number: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    return Supplier;
};