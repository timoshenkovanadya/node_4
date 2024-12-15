const Sequelize = require("sequelize");
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

app.get("/favoritePizza", async (req, res) => {
  try {
    const turtles1 = await db.turtles.findAll({
      include: [
        {
          model: db.pizzas,
          as: "firstFavoritePizza",
          where: { name: "mozzarela" },
        },
             ],
    });
    const turtles2 = await db.turtles.findAll({
        include: [
          {
            model: db.pizzas,
            as: "secondFavoritePizza",
            where: { name: "mozzarela" },
          },
               ],
      });
   const turtles = [...turtles1, ...turtles2]
    console.log(turtles);
    res.status(200).send(turtles);
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
