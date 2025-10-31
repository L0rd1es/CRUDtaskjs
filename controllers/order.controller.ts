import { Request, Response, NextFunction } from "express";
import OrderService from "../services/order.service";
import { orderDTO } from "../DTO/order.dto";

class OrderController {
  createOrder = async (req: Request<{}, {}, orderDTO>, res: Response) => {
    const order = await OrderService.createOrder(req.body);
    res.status(201).json(order);
  };

  getAllOrders = async (req: Request, res: Response) => {
    const orders = await OrderService.getAllOrders();
    res.status(200).json(orders);
  };

  getOrderById = async (req: Request<{ orderId: string }>, res: Response) => {
    const order = await OrderService.getOrderById(Number(req.params.orderId));
    res.status(200).json(order);
  };

  deleteOrder = async (req: Request<{ orderId: string }>, res: Response) => {
    await OrderService.deleteOrder(Number(req.params.orderId));
    res.status(204).send();
  };
}

export default new OrderController();
