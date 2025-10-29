import { Request, Response, NextFunction } from "express";
import OrderService from "../services/order.service";
import { AppError, AppErrorType } from "../errors/appError";
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

    if (!order) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `Order ${req.params.orderId} not found`,
        404
      );
    }

    res.status(200).json(order);
  };

  updateOrder = async (
    req: Request<{ orderId: string }, {}, orderDTO>,
    res: Response
  ) => {
    const orderId = Number(req.params.orderId);

    if (!(await OrderService.getOrderById(orderId))) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `Order with Id:${req.params.orderId} not found`,
        404
      );
    }

    const order = await OrderService.updateOrder(orderId, req.body);

    res.status(200).json(order);
  };

  deleteOrder = async (req: Request<{ orderId: string }>, res: Response) => {
    const orderId = Number(req.params.orderId);

    if (!(await OrderService.getOrderById(orderId))) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `Order with Id:${req.params.orderId} not found`,
        404
      );
    }

    await OrderService.deleteOrder(orderId);
    res.status(204).send();
  };
}

export default new OrderController();
