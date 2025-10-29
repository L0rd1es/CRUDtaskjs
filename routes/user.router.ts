import { Router } from "express";
import UserController from "../controllers/user.controller";
import { validateRequest } from "../middleware/requestValidation";
import { userSchema, userIdSchema } from "../validationSchemas/userSchema";

const router = Router();

router.post("/", validateRequest(userSchema), UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get(
  "/:userId",
  validateRequest(userIdSchema, "params"),
  UserController.getUserById
);
router.put(
  "/:userId",
  validateRequest(userSchema),
  validateRequest(userIdSchema, "params"),
  UserController.updateUser
);
router.delete(
  "/:userId",
  validateRequest(userIdSchema, "params"),
  UserController.deleteUser
);

export default router;
