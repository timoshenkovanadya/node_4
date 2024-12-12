const express = require('express');
const Sequelize = require('sequelize');
const config = require('../config.json');
const db = require('../models')(Sequelize, config);
const pizzaRouter = express.Router();

pizzaRouter.get('/', async (req, res) => {
    try {
        const pizzas = await db.pizzas.findAndCountAll();
        res.json(pizzas);
    } catch (err) {
        res.status(404).send(err);
    }
})

pizzaRouter.post('/', async ({body}, res) => {
    try {
        const pizzas = await db.pizzas.create(body);

        res.json(pizzas);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = pizzaRouter