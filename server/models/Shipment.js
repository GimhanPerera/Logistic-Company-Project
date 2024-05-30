module.exports = (sequelize, DataTypes) => {
    const Shipment = sequelize.define("Shipment",{
        BL_no: {
            type: DataTypes.STRING(20),
            primaryKey: true
        },
        shipping_method: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(4),
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
        displayed_arrival_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status:{
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'waiting'
        }
    }, {
        timestamps: false
    });

    // Shipment.associate = models => {
    //     Shipment.hasMany(models.Order, { foreignKey: 'BL_no' });
    // };

    return Shipment;
};