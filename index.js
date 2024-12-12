const Sequelize = require('sequelize');

const config = require('./config.json');

const db = require('./models')(Sequelize, config);

const express = require('express');


const app = express();
app.use(express.json());
const pizzaRouter = require('./routes/pizzaRouter');
app.use('/pizzas', pizzaRouter);

db.sequelize.sync({force: true})
.then(() => {
    console.log('connected to db');

    app.listen(3000, () => console.log('server started'));
})
.catch((err) => console.log('err', err))



