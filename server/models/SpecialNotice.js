module.exports = (sequelize, DataTypes) => {
    const SpecialNotice = sequelize.define("SpecialNotice",{
        notice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        expire_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        }
    }, {
        timestamps: false
    });

    return SpecialNotice;
};