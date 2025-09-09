const Router = require("express");
const userRouter = require("./user.router");
const productRouter = require("./product.router");
const orderRouter = require("./order.router");

const router = new Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);

module.exports = router;
