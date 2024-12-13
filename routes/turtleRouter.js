const express = require("express");
const Sequelize = require("sequelize");
const config = require("../config.json");
const db = require("../models")(Sequelize, config);
const turtleRouter = express.Router();
const { checkIsString, checkIsNumber } = require("../utils");


//create
pizzaRouter.post("/", async ({ body }, res) => {
  try {
    if (checkValidation(body)) {
      const newPizza = await db.pizzas.create(body);
      res.json(newPizza);
    } else {
      res.status(400).send("invalid data input");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


//readAll
pizzaRouter.get("/", async (req, res) => {
  try {
    const pizzas = await db.pizzas.findAndCountAll();
    res.json(pizzas);
  } catch (err) {
    res.status(500).send(err);
  }
});

//readOne
pizzaRouter.get("/:id", async ({ params }, res) => {
  try {
    console.log("id", params.id);
    const pizza = await db.pizzas.findOne({
      where: {
        id: params.id,
      },
    });
    if (!pizza) {
      return res.status(404).send("There is no pizza with such id");
    }
    res.json(pizza);
  } catch (err) {
    res.status(500).send(err);
  }
});

//update
pizzaRouter.put("/:id", async ({ body, params }, res) => {
  try {
    if (
      (body.name && !checkIsString(body.name)) ||
      (body.description && !checkIsString(body.description)) ||
      (body.calories && !checkIsNumber(body.calories))
    ) {
      return res.status(400).send("invalid data input");
    }
    const pizza = await db.pizzas.findOne({
      where: {
        id: params.id,
      },
    });
    if (!pizza) {
      return res.status(404).send("there is no pizza with such id");
    }
    await db.pizzas.update(body, {
      where: {
        id: params.id,
      },
    });
    const updatedPizza = await db.pizzas.findOne({
      where: {
        id: params.id,
      },
    });
    res.json(updatedPizza);
  } catch (err) {
    res.status(500).send(err);
  }
});

//delete
pizzaRouter.delete("/:id", async ({ params }, res) => {
  try {
    const pizza = await db.pizzas.findOne({
      where: {
        id: params.id,
      },
    });
    if (!pizza) {
      return res.status(404).send("there is no pizza with such id");
    }
    await db.pizzas.destroy({
      where: {
        id: params.id,
      },
    });
    res.json(pizza);
  } catch (err) {
    res.status(500).send(err);
  }
});

function checkValidation(body) {
  return (
    checkIsString(body.name) &&
    checkIsNumber(body.calories) &&
    checkIsString(body.description)
  );
}
module.exports = pizzaRouter;
