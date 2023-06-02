const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const dishesRoutes = Router();

const DishesController = require("../controllers/DishesController");
const ImageDishesController = require("../controllers/ImageDishesController");

const dishesController  = new DishesController();
const imageDishesController = new ImageDishesController
const upload = multer({ dest: "uploads/"});


dishesRoutes.get("/", dishesController.getAll);
dishesRoutes.post("/", upload.single("image"),  dishesController.create);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.put("/:id", dishesController.update);
dishesRoutes.get("/:id", dishesController.getById);
dishesRoutes.patch("/:id/imageDish", upload.single("imageDish"), imageDishesController.update)

module.exports = dishesRoutes;