const Turtle = require('./turtle');
const Weapon = require('./weapon');
const Pizza = require('./pizza');

module.exports = (Sequelize, config) => {
    const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
        host: config.dbHost,
        dialect: config.dbDialect,
      });
    
   
  const turtles = Turtle(Sequelize, sequelize);
  const weapons = Weapon(Sequelize, sequelize);
  const pizzas = Pizza(Sequelize, sequelize);

  turtles.hasOne(weapons);
  turtles.hasMany(pizzas);

  return {
    turtles,
    weapons,
    pizzas,

    sequelize: sequelize,
    Sequelize: Sequelize,
  };
};