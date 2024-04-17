'use strict';

const fs = require('fs');
const path = require('path');
const {Sequelize, DataTypes} = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Customer.hasMany(db.Order, { foreignKey: 'customer_id' });//customer
db.Order.belongsTo(db.Customer, { foreignKey: 'customer_id' });
db.Order.hasOne(db.Payment, { foreignKey: 'order_id' });
db.Payment.belongsTo(db.Order, { foreignKey: 'order_id' });
db.Order.hasOne(db.Price_quotation, { foreignKey: 'order_id' });
db.Price_quotation.belongsTo(db.Order, { foreignKey: 'order_id' });
db.Shipment.hasMany(db.Order, { foreignKey: 'BL_no' });
db.Order.belongsTo(db.Shipment, { foreignKey: 'BL_no' });
db.Order.hasMany(db.Package, { foreignKey: 'order_id' });
db.Package.belongsTo(db.Order, { foreignKey: 'order_id' });
db.Order.hasOne(db.Invoice, { foreignKey: 'order_id' });
db.Invoice.belongsTo(db.Order, { foreignKey: 'order_id' });
db.Order.hasMany(db.Complain, { foreignKey: 'order_id' });
db.Complain.belongsTo(db.Order, { foreignKey: 'order_id' });
db.Employee.hasMany(db.SpecialNotice, { foreignKey: 'emp_id' });
db.SpecialNotice.belongsTo(db.Employee, { foreignKey: 'emp_id' });
db.Employee.hasMany(db.Sms, { foreignKey: 'emp_id' });
db.Sms.belongsTo(db.Employee, { foreignKey: 'emp_id' });
db.Employee.hasMany(db.Package, { foreignKey: 'emp_id' }); //Employee handle many packages
db.Package.belongsTo(db.Employee, { foreignKey: 'emp_id' });
db.Courier.hasMany(db.Order, { foreignKey: 'courier_id' });
db.Order.belongsTo(db.Courier, { foreignKey: 'courier_id' });
db.Order.hasMany(db.Order_sms, { foreignKey: 'order_id' });
db.Order_sms.belongsTo(db.Order, { foreignKey: 'order_id' });
db.Sms.hasMany(db.Order_sms, { foreignKey: 'sms_id' });
db.Order_sms.belongsTo(db.Sms, { foreignKey: 'sms_id' });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.complain = require('./Complain')(sequelize, DataTypes)
// db.courier = require('./Courier')(sequelize, DataTypes)
// db.customer = require('./Customer')(sequelize, DataTypes)
// db.emp_Package = require('./Emp_Package')(sequelize, DataTypes)
// db.employee = require('./Employee')(sequelize, DataTypes)
// db.invoice = require('./Invoice')(sequelize, DataTypes)
// db.order = require('./Order')(sequelize, DataTypes)
// db.package = require('./Package')(sequelize, DataTypes)
// db.payment = require('./Payment')(sequelize, DataTypes)
// db.price_quotation = require('./PriceQuotation')(sequelize, DataTypes)
// db.shipment = require('./Shipment')(sequelize, DataTypes)
// db.sms = require('./Sms')(sequelize, DataTypes)
// db.specialNotice = require('./SpecialNotice')(sequelize, DataTypes)
// db.order_sms = require('./Order_sms')(sequelize, DataTypes)


db.sequelize.sync({force: false})
.then(() => {
  console.log('Yes re-sync done')
})

// db.customer.hasMany(db.order, { foreignKey: 'customer_id' });

// db.order.hasOne(db.payment, { foreignKey: 'order_id' });
// db.order.hasOne(db.price_quotation, { foreignKey: 'order_id' });
// db.shipment.hasMany(db.order, { foreignKey: 'BL_no' });
// db.order.hasMany(db.package, { foreignKey: 'order_id' });
// db.order.hasOne(db.invoice, { foreignKey: 'order_id' });
// db.order.hasMany(db.complain, { foreignKey: 'order_id' });
// db.employee.hasMany(db.specialNotice, { foreignKey: 'emp_id' });
// db.employee.hasMany(db.sms, { foreignKey: 'emp_id' });
// db.employee.hasMany(db.package, { foreignKey: 'emp_id' }); //Employee handle many packages
// db.courier.hasMany(db.order, { foreignKey: 'courier_id' });
// db.order.hasMany(db.order_sms, { foreignKey: 'order_id' });
// db.sms.hasMany(db.order_sms, { foreignKey: 'sms_id' });

module.exports = db;
