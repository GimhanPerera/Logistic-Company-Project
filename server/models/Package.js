module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define("Package",{
        shipping_mark: {
            type: DataTypes.STRING(20),
            primaryKey: true
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
            allowNull: true,
        },
        warehouse_tracking_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        length: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: true,
        },
        height: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: true,
        },
        width: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: true,
        },
        weight: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: true,
        },
        volume_metric_weight: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: true,
        },
        gross_weight: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
        chargable_weight: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
        },
        collected_date_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        rate: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tax: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: true,
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