const { Router } = require("express");
const DishesController = require("../controllers/DishesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const dishesRoutes = Router();


const dishesController  = new DishesController();


dishesRoutes.post("/",  dishesController.create);
//dishesRoutes.put("/", ensureAuthenticated, dishesController.update);

module.exports = dishesRoutes;