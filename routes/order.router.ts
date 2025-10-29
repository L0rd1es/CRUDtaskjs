import { Router } from "express";
import OrderController from "../controllers/order.controller";
import { validateRequest } from "../middleware/requestValidation";
import { orderSchema, orderIdSchema } from "../validationSchemas/orderSchema";

const router = Router();

router.post("/", validateRequest(orderSchema), OrderController.createOrder);
router.get("/", OrderController.getAllOrders);
router.get(
  "/:orderId",
  validateRequest(orderIdSchema, "params"),
  OrderController.getOrderById
);
router.put(
  "/:orderId",
  validateRequest(orderSchema),
  validateRequest(orderIdSchema, "params"),
  OrderController.updateOrder
);
router.delete(
  "/:orderId",
  validateRequest(orderIdSchema, "params"),
  OrderController.deleteOrder
);

export default router;
