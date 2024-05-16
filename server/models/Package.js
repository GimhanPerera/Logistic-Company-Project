module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define("Package", {
        shipping_mark: {
            type: DataTypes.STRING(20),
            primaryKey: true
        },
        items: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        package_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(13),
            allowNull: false,
        },
        local_tracking_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        warehouse_tracking_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: null,
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
            allowNull: true,
            defaultValue: null,
        },
        collected_date_time: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        collected_count: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        rate: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        tax: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            defaultValue: null,
        },
        total: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            defaultValue: null,
        },
    }, {
        timestamps: false
    });

    return Package;
};