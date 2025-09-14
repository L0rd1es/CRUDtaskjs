const userService = require("../services/user.service");
const isAlphabetic = require("../utils/validation.isAlphabetic");

class UserController {
  async createUser(req, res, next) {
    const errors = [];
    const { name, surname } = req.body || {};
    try {
      if (name == null) errors.push("Name is required");
      if (surname == null) errors.push("Surname is required");
      if (!isAlphabetic(name))
        errors.push("Name can contain English letters only");
      if (!isAlphabetic(surname))
        errors.push("Surname can contain English letters only");

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      const user = await userService.createUser(name, surname);
      res.status(201).json(user);
    } catch (err) {
      return next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json(users);
    } catch (err) {
      return next(err);
    }
  }

  async getUserById(req, res, next) {
    const userId = req.params.id;
    try {
      if (userId == null || isNaN(userId)) {
        return res.status(400).json({
          message: "Validation failed",
          errors: ["Incorrect user id"],
        });
      }
      const user = await userService.getUserById(userId);
      if (user == null) {
        return res.status(404).json({
          message: "Not found",
          errors: [`User with id:${userId} not found`],
        });
      }
      res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  }

  async updateUser(req, res, next) {
    const errors = [];
    const { userId, name, surname } = req.body;
    try {
      if (name == null) errors.push("Name is required");
      if (surname == null) errors.push("Surname is required");
      if (userId == null) errors.push("User ID is required");
      if (isNaN(userId)) errors.push("user ID must be a number");

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      const user = await userService.updateUser(userId, name, surname);
      res.status(200).json(user);
    } catch (err) {
      if (err.message === "Not found") {
        return res.status(404).json({
          message: err.message,
          errors: [`User with id:${userId} not found`],
        });
      }
      return next(err);
    }
  }

  async deleteUser(req, res, next) {
    const errors = [];
    const userId = req.params.id;
    try {
      if (userId == null) errors.push("user ID is required");
      if (isNaN(userId)) errors.push("user ID must be a number");

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      await userService.deleteUser(userId);
      res.status(200).send();
    } catch (err) {
      if (err.message === "Not found") {
        return res.status(404).json({
          message: err.message,
          errors: [`User with id:${userId} not found`],
        });
      }
      return next(err);
    }
  }
}

module.exports = new UserController();
