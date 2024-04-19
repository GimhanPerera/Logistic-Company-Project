module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define("Employee", {
        emp_id: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        f_name: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        l_name: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        nic: {
            type: DataTypes.STRING(12),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        tel_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        position: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        last_attempt_date_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        wrong_attempts: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        timestamps: false
    });

    return Employee;
};