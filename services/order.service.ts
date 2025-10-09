import OrderRepository from "../repositories/order.repository";

class OrderService {
  async createOrder(
    userId: number,
    products: {
      product_id: number;
      quantity: number;
    }[]
  ) {
    const order = await OrderRepository.createOrder(userId, products);
    return order;
  }

  async getAllOrders() {
    return await OrderRepository.getAllOrders();
  }

  async getOrderById(orderId: number) {
    return await OrderRepository.getOrderById(orderId);
  }

  async updateOrder(
    orderId: number,
    products: {
      product_id: number;
      quantity: number;
    }[]
  ) {
    return await OrderRepository.updateOrder(orderId, products);
  }

  async deleteOrder(orderId: number) {
    return await OrderRepository.deleteOrder(orderId);
  }
}

export default new OrderService();
