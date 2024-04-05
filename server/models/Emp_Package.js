module.exports = (sequelize, DataTypes) => {
    const Emp_Package = sequelize.define("Emp_Package",{
        date_time: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        timestamps: false
    });

    return Emp_Package;
};