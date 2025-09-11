const orderRepository = require("../repositories/order.repository");
const productRepository = require("../repositories/product.repository");

class OrderService {
  async createOrder(userId, products) {
    const order = await orderRepository.createOrder(userId, products);
    return order;
  }

  async getAllOrders() {
    return await orderRepository.getAllOrders();
  }

  async getOrderById(orderId) {
    return await orderRepository.getOrderById(orderId);
  }

  async updateOrder(orderId, products) {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) throw new Error("Not found");

    return await orderRepository.updateOrder(orderId, products);
  }

  async deleteOrder(orderId) {
    return await orderRepository.deleteOrder(orderId);
  }
}

module.exports = new OrderService();
