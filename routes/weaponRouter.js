const express = require("express");
const Sequelize = require("sequelize");
const config = require("../config.json");
const db = require("../models")(Sequelize, config);
const weaponRouter = express.Router();
const { checkIsString, checkIsNumber } = require("../utils");


//create
weaponRouter.post("/", async ({ body }, res) => {
  try {
    if (checkValidation(body)) {
      const newWeapon = await db.weapons.create(body);
      res.json(newWeapon);
    } else {
      res.status(400).send("invalid data input");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


//readAll
weaponRouter.get("/", async (req, res) => {
  try {
    const weapons = await db.weapons.findAndCountAll();
    res.json(weapons);
  } catch (err) {
    res.status(500).send(err);
  }
});

//readOne
weaponRouter.get("/:id", async ({ params }, res) => {
  try {
    const weapon = await db.weapons.findOne({
      where: {
        id: params.id,
      },
    });
    if (!weapon) {
      return res.status(404).send("There is no weapon with such id");
    }
    res.json(weapon);
  } catch (err) {
    res.status(500).send(err);
  }
});

//update
weaponRouter.put("/:id", async ({ body, params }, res) => {
  try {
    if (
      (body.name && !checkIsString(body.name)) ||
      (body.dps && !checkIsNumber(body.dps)) 
    ) {
      return res.status(400).send("invalid data input");
    }
    const weapon = await db.weapons.findOne({
      where: {
        id: params.id,
      },
    });
    if (!weapon) {
      return res.status(404).send("there is no weapon with such id");
    }
    await db.weapons.update(body, {
      where: {
        id: params.id,
      },
    });
    const updatedWeapon = await db.weapons.findOne({
      where: {
        id: params.id,
      },
    });
    res.json(updatedWeapon);
  } catch (err) {
    res.status(500).send(err);
  }
});

//delete
weaponRouter.delete("/:id", async ({ params }, res) => {
  try {
    const weapon = await db.weapons.findOne({
      where: {
        id: params.id,
      },
    });
    if (!weapon) {
      return res.status(404).send("there is no weapon with such id");
    }
    await db.weapons.destroy({
      where: {
        id: params.id,
      },
    });
    res.json(weapon);
  } catch (err) {
    res.status(500).send(err);
  }
});

function checkValidation(body) {
  return (
    checkIsString(body.name) &&
    checkIsNumber(body.dps) 
  );
}
module.exports = weaponRouter;
