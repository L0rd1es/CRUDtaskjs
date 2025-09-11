const Router = require("express");
const userController = require("../controllers/user.controller");

const router = new Router();

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
