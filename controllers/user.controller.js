const userService = require("../services/user.service");
const isAlphabetic = require("../utils/validation.isAlphabetic");

class UserController {
  async createUser(req, res, next) {
    const errors = [];
    const { name, surname } = req.body || {};
    try {
      if (!name) errors.push("Name is required");
      if (!surname) errors.push("Surname is required");
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

  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers();
      if (!users[0]) {
        return res
          .status(404)
          .json({ message: "Not found", errors: ["Users not found"] });
      }

      res.status(200).json(users);
    } catch (err) {
      return next(err);
    }
  }

  async getOneUser(req, res, next) {
    const id = req.params.id;
    try {
      if (!id || isNaN(id)) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: ["Incorrect id"] });
      }
      const user = await userService.getOneUser(id);
      if (!user) {
        return res.status(404).json({
          message: "Not found",
          errors: [`User with id:${id} not found`],
        });
      }
      res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  }

  async updateUser(req, res, next) {
    const errors = [];
    const { id, name, surname } = req.body;
    try {
      if (!name) errors.push("Name is required");
      if (!surname) errors.push("Surname is required");
      if (!id) errors.push("Id is required");
      if (isNaN(id)) errors.push("Id must be a number");

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      const user = await userService.updateUser(id, name, surname);
      res.status(200).json(user);
    } catch (err) {
      if (err.message === "Not found") {
        return res.status(404).json({
          message: err.message,
          errors: [`User with id:${id} not found`],
        });
      }
      return next(err);
    }
  }

  async deleteUser(req, res, next) {
    const errors = [];
    const id = req.params.id;
    try {
      if (!id) errors.push("Id is required");
      if (isNaN(id)) errors.push("Id must be a number");

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      await userService.deleteUser(id);
      res.status(204).send();
    } catch (err) {
      if (err.message === "Not found") {
        return res.status(404).json({
          message: err.message,
          errors: [`User with id:${id} not found`],
        });
      }
      return next(err);
    }
  }
}

module.exports = new UserController();
