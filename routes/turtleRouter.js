const express = require("express");
const Sequelize = require("sequelize");
const config = require("../config.json");
const db = require("../models")(Sequelize, config);
const turtleRouter = express.Router();
const { checkIsString, checkIsNumber } = require("../utils");

//create
turtleRouter.post("/", async ({ body }, res) => {
  try {
    const newTurtle = await db.turtles.create(body);
    res.json(newTurtle);
  } catch (err) {
    res.status(500).send(err);
  }
});

//readAll
turtleRouter.get("/", async (req, res) => {
  try {
    const turtles = await db.turtles.findAndCountAll();
    res.json(turtles);
  } catch (err) {
    res.status(500).send(err);
  }
});

//readOne
turtleRouter.get("/:id", async ({ params }, res) => {
  try {
    const turtle = await db.turtles.findOne({
      where: {
        id: params.id,
      },
    });
    if (!turtle) {
      return res.status(404).send("There is no turtle with such id");
    }
    res.json(turtle);
  } catch (err) {
    res.status(500).send(err);
  }
});

//update
turtleRouter.put("/:id", async ({ body, params }, res) => {
  try {
    if (
      (body.name && !checkIsString(body.name)) ||
      (body.color && !checkIsString(body.color)) ||
      (body.weaponId && !checkIsNumber(body.weaponId)) ||
      (body.firstFavoritePizzaId &&
        !checkIsNumber(body.firstFavoritePizzaId)) ||
      (body.secondFavoritePizzaId && !checkIsNumber(body.secondFavoritePizzaId))
    ) {
      return res.status(400).send("invalid data input");
    }
    const turtle = await db.turtles.findOne({
      where: {
        id: params.id,
      },
    });
    if (!turtle) {
      return res.status(404).send("there is no turtle with such id");
    }
    await db.turtles.update(body, {
      where: {
        id: params.id,
      },
    });
    const updatedTurtle = await db.turtles.findOne({
      where: {
        id: params.id,
      },
    });
    res.json(updatedTurtle);
  } catch (err) {
    res.status(500).send(err);
  }
});

//delete
turtleRouter.delete("/:id", async ({ params }, res) => {
  try {
    const turtle = await db.turtles.findOne({
      where: {
        id: params.id,
      },
    });
    if (!turtle) {
      return res.status(404).send("there is no turtle with such id");
    }
    await db.turtles.destroy({
      where: {
        id: params.id,
      },
    });
    res.json(turtle);
  } catch (err) {
    res.status(500).send(err);
  }
});

function checkValidation(body) {
  return (
    checkIsString(body.name) &&
    checkIsString(body.color) &&
    checkIsNumber(body.weaponId) &&
    checkIsNumber(body.firstFavoritePizzaId) &&
    checkIsNumber(body.secondFavoritePizzaId)
  );
}
module.exports = turtleRouter;
