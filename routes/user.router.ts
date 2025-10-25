import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();

router.post("/", (req, res, next) => UserController.createUser(req, res, next));
router.get("/", (req, res, next) => UserController.getAllUsers(req, res, next));
router.get("/:id", (req, res, next) =>
  UserController.getUserById(req, res, next)
);
router.put("/:id", (req, res, next) =>
  UserController.updateUser(req, res, next)
);
router.delete("/:id", (req, res, next) =>
  UserController.deleteUser(req, res, next)
);

export default router;
