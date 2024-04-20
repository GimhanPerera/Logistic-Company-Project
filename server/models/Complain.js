module.exports = (sequelize, DataTypes) => {
    const Complain = sequelize.define("Complain", {
        complain_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        complain: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Complain;
};