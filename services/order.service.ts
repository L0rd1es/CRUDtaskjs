import { orderDTO } from "../DTO/order.dto";
import OrderRepository from "../repositories/order.repository";

class OrderService {
  async createOrder(dto: orderDTO) {
    const order = await OrderRepository.createOrder(dto);
    return order;
  }

  async getAllOrders() {
    return await OrderRepository.getAllOrders();
  }

  async getOrderById(orderId: number) {
    return await OrderRepository.getOrderById(orderId);
  }

  async updateOrder(orderId: number, dto: orderDTO) {
    return await OrderRepository.updateOrder(orderId, dto);
  }

  async deleteOrder(orderId: number) {
    return await OrderRepository.deleteOrder(orderId);
  }
}

export default new OrderService();
