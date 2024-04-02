module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define("Package",{
        shipping_mark: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        items: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        local_tracking_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        warehouse_tracking_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        length: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
        height: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
        width: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
        weight: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
        volume_metric_weight: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
        gross_weight: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
        chargable_weight: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
        rate: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tax: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
        total: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    return Package;
};