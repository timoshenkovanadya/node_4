const { Sequelize, DataTypes, Op } = require("sequelize");
const config = require("./config.json");
const db = require("./models")(Sequelize, config);
const express = require("express");
const pizzaRouter = require("./routes/pizzaRouter");
const weaponRouter = require("./routes/weaponRouter");
const turtleRouter = require("./routes/turtleRouter");

const app = express();
app.use(express.json());

app.use("/pizzas", pizzaRouter);
app.use("/weapon", weaponRouter);
app.use("/turtle", turtleRouter);

//find all turtles, whose favorite pizza is mozzarela
app.get("/favoritePizza", async (req, res) => {
  try {
    const turtles = await db.turtles.findAll({
      include: [
        {
          model: db.pizzas,
          as: "firstFavoritePizza",
          where: { name: "mozzarela" },
          required: false,
        },
        {
          model: db.pizzas,
          as: "secondFavoritePizza",
          where: { name: "mozzarela" },
          required: false,
        },
      ],
      where: {
        [Op.or]: [
          { "$firstFavoritePizza.name$": "mozzarela" },
          { "$secondFavoritePizza.name$": "mozzarela" },
        ],
      },
    });
    console.log(turtles);
    res.status(200).send(turtles);
  } catch (err) {
    res.status(500).send(err);
  }
});

//find all pizzas marked as favorite
app.get("/favoritePizzas", async (req, res) => {
  try {
    const firstFavoritePizzas = await db.pizzas.findAll({
      include: [
        {
          model: db.turtles,
          as: "firstFavoritePizza",
          attributes: [],
          where: { firstFavoritePizzaId: { [Op.col]: "pizzas.id" } },
        },
      ],
      attributes: ["id", "name", "description", "calories"],
      distinct: true,
    });
    const secondFavoritePizzas = await db.pizzas.findAll({
      include: [
        {
          model: db.turtles,
          as: "secondFavoritePizza",
          attributes: [],
          where: { secondFavoritePizzaId: { [Op.col]: "pizzas.id" } },
        },
      ],
      attributes: ["id", "name", "description", "calories"],
      distinct: true,
    });
    const favoritePizzas = [
      ...firstFavoritePizzas,
      ...secondFavoritePizzas,
    ].reduce((acc, pizza) => {
      if (!acc.some((item) => item.id === pizza.id)) {
        acc.push(pizza);
      }
      return acc;
    }, []);
    res.status(200).send(favoritePizzas);
  } catch (err) {
    res.status(500).send(err);
  }
});

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("connected to db");

    app.listen(3000, () => console.log("server started"));
  })
  .catch((err) => console.log("err", err));
