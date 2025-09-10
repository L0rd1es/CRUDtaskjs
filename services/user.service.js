const userRepository = require("../repositories/user.repository");

class UserService {
  async createUser(name, surname) {
    return await userRepository.createUser(name, surname);
  }

  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

  async getUserById(userId) {
    return await userRepository.getUserById(userId);
  }

  async updateUser(userId, name, surname) {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new Error("Not found");
    return await userRepository.updateUser(userId, name, surname);
  }

  async deleteUser(userId) {
    return await userRepository.deleteUser(userId);
  }
}

module.exports = new UserService();
