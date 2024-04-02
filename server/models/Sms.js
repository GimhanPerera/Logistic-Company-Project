module.exports = (sequelize, DataTypes) => {
    const Sms = sequelize.define("Sms", {
        sms_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        massage: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        Date_time: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Sms;
};