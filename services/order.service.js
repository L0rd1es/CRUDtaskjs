// order.service.js

const orderRepository = require("../repositories/order.repository");
const productRepository = require("../repositories/product.repository");

class OrderService {
  async createOrder(userId, products) {
    //get current price for each product to save
    products.forEach(async (element) => {
      const product = await productRepository.getProductById(
        element.product_id
      );
      element.unit_price = product.price;
    });

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

    //get current price for each product to save
    products.forEach(async (element) => {
      const product = await productRepository.getProductById(
        element.product_id
      );
      element.unit_price = product.price;
    });

    return await orderRepository.updateOrder(orderId, products);
  }

  async deleteOrder(orderId) {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) throw new Error("Not found");
    return await orderRepository.deleteOrder(orderId);
  }
}

module.exports = new OrderService();
