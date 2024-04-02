module.exports = (sequelize, DataTypes) => {
    const Shipment = sequelize.define("Shipment",{
        BL_no: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        shipping_method: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        loaded_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        arrival_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        desplayed_arriveal_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        }
    }, {
        timestamps: false
    });

    return Shipment;
};