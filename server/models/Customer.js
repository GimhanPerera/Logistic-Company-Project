module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
        customer_id: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        passcode: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        f_name: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        l_name: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        tel_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        nic: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        wrong_attempts: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        last_attempt_date_time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },{
        timestamps: false
    });

    // Customer.associate = models => {
    //     //associations
    //     Customer.hasMany(models.Order, { foreignKey: 'customer_id' });
    // };

    return Customer;
};

