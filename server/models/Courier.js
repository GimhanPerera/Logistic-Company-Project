module.exports = (sequelize, DataTypes) => {
    const Courier = sequelize.define("Courier",{
        courier_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        tel_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    return Courier;
};