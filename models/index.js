const Turtle = require("./turtle");
const Weapon = require("./weapon");
const Pizza = require("./pizza");

module.exports = (Sequelize, config) => {
  const sequelize = new Sequelize(
    config.dbName,
    config.dbUser,
    config.dbPassword,
    {
      host: config.dbHost,
      dialect: config.dbDialect,
    }
  );

  const turtles = Turtle(Sequelize, sequelize);
  const weapons = Weapon(Sequelize, sequelize);
  const pizzas = Pizza(Sequelize, sequelize);

  turtles.prototype.createPizza = async function (pizza) {
    const newPizza = await pizzas.create(pizza);
    this.firstFavoritePizzaId = newPizza.id;
    await this.save();
    return newPizza;
  };

  weapons.hasOne(turtles, { foreignKey: "weaponId" });
  turtles.belongsTo(weapons, { foreignKey: "weaponId" });
  turtles.belongsTo(pizzas, {
    foreignKey: "firstFavoritePizzaId",
    as: "firstFavoritePizza",
  });
  pizzas.hasMany(turtles, {
    foreignKey: "firstFavoritePizzaId",
    as: "firstFavoritePizza",
  });
  turtles.belongsTo(pizzas, {
    foreignKey: "secondFavoritePizzaId",
    as: "secondFavoritePizza",
  });
  pizzas.hasMany(turtles, {
    foreignKey: "secondFavoritePizzaId",
    as: "secondFavoritePizza",
  });

  return {
    turtles,
    weapons,
    pizzas,

    sequelize: sequelize,
    Sequelize: Sequelize,
  };
};
