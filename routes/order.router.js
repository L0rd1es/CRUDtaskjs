const Router = require("express");
const OrderController = require("../controllers/order.controller");

const router = new Router();

router.post("/", OrderController.createOrder);
router.get("/", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderById);
router.put("/", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);

module.exports = router;
