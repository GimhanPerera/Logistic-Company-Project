module.exports = (sequelize, DataTypes) => {
    const Complain = sequelize.define("Complain", {
        complain_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        complain: {
            type: DataTypes.STRING(100),
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