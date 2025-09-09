const orderService = require("../services/order.service");

class OrderController {
  async createOrder(req, res, next) {
    const errors = [];

    const { userId, products } = req.body || {};
    try {
      if (!userId) errors.push("User ID is required"); // what happens if userId is 0? test it and you will be surprised
      // use products.length > 0 instead of products[0]. Also what happens if products is null/undefined?
      if (!products[0]) errors.push("At least one product ID is required");
      if (isNaN(userId)) errors.push("User ID must be a number"); // fun note: check how isNaN works if userId is null/undefined

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      const order = await orderService.createOrder(userId, products);
      res.status(201).json(order);
    } catch (err) {
      return next(err);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const orders = await orderService.getAllOrders();
      if (!orders[0]) { // use lenght here as well. Check all other places where you use checks like this.
        return res
          .status(404)
          .json({ message: "Not found", errors: ["Orders not found"] }); // it's normal if orders are empty, no need in 404.
      }

      res.status(200).json(orders);
    } catch (err) {
      return next(err);
    }
  }

  async getOrderById(req, res, next) {
    const orderId = req.params.id;
    try {
      if (!orderId || isNaN(orderId)) {
        return res.status(400).json({
          message: "Validation failed",
          errors: ["Incorrect order id"],
        });
      }
      const order = await orderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({
          message: "Not found",
          errors: [`Order with id:${orderId} not found`],
        });
      }
      res.status(200).json(order);
    } catch (err) {
      return next(err);
    }
  }

  async updateOrder(req, res, next) {
    const errors = [];
    const { orderId, products } = req.body || {};
    try {
      if (!products) errors.push("At least one product ID is required"); // same as above, check all other places where you use checks like this.
      if (!orderId) errors.push("Order ID is required");
      if (isNaN(orderId)) errors.push("Order ID must be a number");

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      const order = await orderService.updateOrder(orderId, products);
      res.status(200).json(order);
    } catch (err) {
      if (err.message === "Not found") {
        return res.status(404).json({
          message: err.message,
          errors: [`Order with id:${orderId} not found`],
        });
      }
      return next(err);
    }
  }

  async deleteOrder(req, res, next) {
    const errors = [];
    const orderId = req.params.id;
    try {
      if (!orderId) errors.push("Order ID is required");
      if (isNaN(orderId)) errors.push("Order ID must be a number");

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      await orderService.deleteOrder(orderId);
      res.status(200).send();
    } catch (err) {
      if (err.message === "Not found") {
        return res.status(404).json({
          message: err.message,
          errors: [`Order with id:${id} not found`],
        });
      }
      return next(err);
    }
  }
}

module.exports = new OrderController();
