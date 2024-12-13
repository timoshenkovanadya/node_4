const Sequelize = require('sequelize');
const config = require('./config.json');
const db = require('./models')(Sequelize, config);
const express = require('express');
const pizzaRouter = require('./routes/pizzaRouter');
const weaponRouter = require('./routes/weaponRouter')

const app = express();
app.use(express.json());

app.use('/pizzas', pizzaRouter);
app.use('/weapon', weaponRouter);


db.sequelize.sync()
.then(() => {
    console.log('connected to db');

    app.listen(3000, () => console.log('server started'));
})
.catch((err) => console.log('err', err))



