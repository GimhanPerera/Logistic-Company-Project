module.exports = (sequelize, DataTypes) => {
    const SpecialNotice = sequelize.define("SpecialNotice",{
        notice_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        expire_date: {//only date store here
            type: DataTypes.DATEONLY,
            allowNull: true,
        }
    }, {
        timestamps: false
    });

    return SpecialNotice;
};