//user.routes.js

const Router = require("express");
const userController = require("../controllers/user.controller");

const router = new Router();

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getOneUser);
router.put("/", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
