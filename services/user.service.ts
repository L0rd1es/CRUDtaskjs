import * as UserRepository from "../repositories/user.repository";

class UserService {
  async createUser(name: string, surname: string) {
    return await UserRepository.createUser(name, surname);
  }

  async getAllUsers() {
    return await UserRepository.getAllUsers();
  }

  async getUserById(userId: number) {
    return await UserRepository.getUserById(userId);
  }

  async updateUser(userId: number, name: string, surname: string) {
    const user = await UserRepository.getUserById(userId);
    if (!user) throw new Error("Not found");
    return await UserRepository.updateUser(userId, name, surname);
  }

  async deleteUser(userId: number) {
    return await UserRepository.deleteUser(userId);
  }
}

export default new UserService();
