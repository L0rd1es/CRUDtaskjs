import { userDTO } from "../DTO/user.dto";
import { AppError, AppErrorType } from "../errors/appError";
import UserRepository from "../repositories/user.repository";

class UserService {
  async createUser(dto: userDTO) {
    return await UserRepository.createUser(dto);
  }

  async getAllUsers() {
    return await UserRepository.getAllUsers();
  }

  async getUserById(userId: number) {
    return await UserRepository.getUserById(userId);
  }

  async updateUser(userId: number, dto: userDTO) {
    return await UserRepository.updateUser(userId, dto);
  }

  async deleteUser(userId: number) {
    return await UserRepository.deleteUser(userId);
  }
}

export default new UserService();
