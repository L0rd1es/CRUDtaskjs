import { Request, Response, NextFunction } from "express";
import OrderService from "../services/order.service";
import { AppError } from "../errors/appError";

class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { userId, products } = (req.body ?? {}) as {
      userId: number;
      products: {
        product_id: number;
        quantity: number;
      }[];
    };

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
      throw new AppError("VALIDATION", `Validation failed: ${errors}`, 400);
    }

    const order = await OrderService.createOrder(userId, products);
    res.status(201).json(order);
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    const orders = await OrderService.getAllOrders();
    res.status(200).json(orders);
  }

  async getOrderById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new AppError(
        "VALIDATION",
        `Order ID must be a positive integer`,
        400
      );
    }

    const order = await OrderService.getOrderById(orderId);

    if (order == null) {
      throw new AppError("NOT_FOUND", `Order ${req.params.id} not found`, 404);
    }

    res.status(200).json(order);
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { orderId, products } = (req.body ?? {}) as {
      orderId: number;
      products: {
        product_id: number;
        quantity: number;
      }[];
    };

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
      throw new AppError("VALIDATION", `Validation failed: ${errors}`, 400);
    }

    const order = await OrderService.updateOrder(orderId, products);

    res.status(200).json(order);
  }

  async deleteOrder(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const errors: string[] = [];
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      errors.push("Order ID must be a positive integer");
    }

    if (errors.length > 0) {
      throw new AppError("VALIDATION", `Validation failed: ${errors}`, 400);
    }

    await OrderService.deleteOrder(orderId);
    res.status(204).send();
  }
}

export default new OrderController();
