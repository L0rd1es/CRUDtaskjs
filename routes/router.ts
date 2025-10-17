import { Router } from "express";
import userRouter from "./user.router";
import productRouter from "./product.router";
import orderRouter from "./order.router";

const router = Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);

export default router;
