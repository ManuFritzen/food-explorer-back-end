const { Router } = require("express");
const UsersController = require("../controllers/UsersController");

const usersRoutes = Router();


const usersController  = new UsersController();


usersRoutes.post("/",  usersController.create);
userRoutes.put("/:id", usersController.update);

module.exports = usersRoutes;