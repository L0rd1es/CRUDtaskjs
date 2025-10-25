import { Router } from "express";
import OrderController from "../controllers/order.controller";

const router = Router();

router.post("/", (req, res, next) =>
  OrderController.createOrder(req, res, next)
);
router.get("/", (req, res, next) =>
  OrderController.getAllOrders(req, res, next)
);
router.get("/:id", (req, res, next) =>
  OrderController.getOrderById(req, res, next)
);
router.put("/:id", (req, res, next) =>
  OrderController.updateOrder(req, res, next)
);
router.delete("/:id", (req, res, next) =>
  OrderController.deleteOrder(req, res, next)
);

export default router;
