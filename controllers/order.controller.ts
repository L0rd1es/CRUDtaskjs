import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/order.service";

class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { userId, products } = (req.body ?? {}) as {
      userId?: number;
      products?: {
        product_id: number;
        quantity: number;
      }[];
    };

    try {
      if (!Number.isInteger(userId) || userId <= 0) {
        errors.push("User ID must be a positive integer");
      }
      if (!Array.isArray(products) || products.length === 0) {
        errors.push("At least one product is required");
      } else {
        products.forEach((p, i) => {
          if (!Number.isInteger(p.product_id) || p.product_id <= 0) {
            errors.push(`products[${i}].product_id must be a positive integer`);
          }
          if (!Number.isInteger(p.quantity) || p.quantity <= 0) {
            errors.push(`products[${i}].quantity must be a positive integer`);
          }
        });
      }

      if (errors.length > 0) {
        return next({
          type: "VALIDATION",
          message: "Validation failed",
          details: errors,
        });
      }

      const order = await orderService.createOrder(userId, products);
      res.status(201).json(order);
    } catch (err) {
      return next(err);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getAllOrders();

      res.status(200).json(orders);
    } catch (err) {
      return next(err);
    }
  }

  async getOrderById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderId = Number(req.params.id);

      if (!Number.isInteger(orderId) || orderId <= 0) {
        return next({
          type: "VALIDATION",
          message: "Validation failed",
          details: ["Order ID must be a positive integer"],
        });
      }

      const order = await orderService.getOrderById(orderId);

      if (order == null) {
        return next({
          type: "NOT_FOUND",
          message: `Order with id=${orderId} not found`,
          details: [],
        });
      }
      res.status(200).json(order);
    } catch (err) {
      return next(err);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { orderId, products } = (req.body ?? {}) as {
      orderId?: number;
      products?: {
        product_id: number;
        quantity: number;
      }[];
    };

    try {
      if (!Number.isInteger(orderId) || orderId <= 0) {
        errors.push("Order ID must be a positive integer");
      }
      if (!Array.isArray(products) || products.length === 0) {
        errors.push("At least one product is required");
      } else {
        products.forEach((p, i) => {
          if (!Number.isInteger(p.product_id) || p.product_id <= 0) {
            errors.push(`products[${i}].product_id must be a positive integer`);
          }
          if (!Number.isInteger(p.quantity) || p.quantity <= 0) {
            errors.push(`products[${i}].quantity must be a positive integer`);
          }
        });
      }

      if (errors.length > 0) {
        return next({
          type: "VALIDATION",
          message: "Validation failed",
          details: errors,
        });
      }

      const order = await orderService.updateOrder(orderId, products);

      res.status(200).json(order);
    } catch (err) {
      if (err.message === "Not found") {
        return next({
          type: "NOT_FOUND",
          message: `Order with id=${orderId} not found`,
          details: [],
        });
      }
      return next(err);
    }
  }

  async deleteOrder(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const errors: string[] = [];
    const orderId = Number(req.params.id);
    try {
      if (!Number.isInteger(orderId) || orderId <= 0) {
        errors.push("Order ID must be a positive integer");
      }

      if (errors.length > 0) {
        return next({
          type: "VALIDATION",
          message: "Validation failed",
          details: errors,
        });
      }

      await orderService.deleteOrder(orderId);
      res.status(204).send();
    } catch (err) {
      if (err.message === "Not found") {
        return next({
          type: "NOT_FOUND",
          message: `Order with id=${orderId} not found`,
          details: [],
        });
      }
      return next(err);
    }
  }
}

export default new OrderController();
