module.exports = (sequelize, DataTypes) => {
    const Emp_Package = sequelize.define("Emp_Package",{
        emp_id: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        shipping_mark: {
            type: DataTypes.STRING(20),
            primaryKey: true
        },
        date_time: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        timestamps: false
    });

    return Emp_Package;
};