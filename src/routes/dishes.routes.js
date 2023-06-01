const { Router } = require("express");
const DishesController = require("../controllers/DishesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const dishesRoutes = Router();


const dishesController  = new DishesController();


dishesRoutes.get("/", dishesController.getAll);
dishesRoutes.post("/",  dishesController.create);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.put("/:id", dishesController.update);
dishesRoutes.get("/:id", dishesController.getById);

module.exports = dishesRoutes;