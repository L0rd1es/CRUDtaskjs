// user.controller.js

const userRepository = require("../repositories/user.repository");

class UserService {
  async createUser(name, surname) {
    return await userRepository.createUser(name, surname);
  }

  async getUsers() {
    return await userRepository.getUsers();
  }

  async getOneUser(id) {
    return await userRepository.getOneUser(id);
  }

  async updateUser(id, name, surname) {
    const user = await userRepository.getOneUser(id);
    if (!user) throw new Error("Not found");
    return await userRepository.updateUser(id, name, surname);
  }

  async deleteUser(id) {
    const user = await userRepository.getOneUser(id);
    if (!user) throw new Error("Not found");
    return await userRepository.deleteUser(id);
  }
}

module.exports = new UserService();
