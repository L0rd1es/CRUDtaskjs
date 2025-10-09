import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { isAlphabetic } from "../utils/validation.isAlphabetic";

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { name, surname } = (req.body ?? {}) as {
      name: string;
      surname: string;
    };

    if (name == null || name === "") {
      errors.push("Name is required");
    } else if (!isAlphabetic(name))
      errors.push("Name can contain English letters only");

    if (surname == null || surname === "") {
      errors.push("Surname is required");
    } else if (!isAlphabetic(surname))
      errors.push("Surname can contain English letters only");

    if (errors.length > 0) {
      return next({
        type: "VALIDATION",
        message: "Validation failed",
        details: errors,
      });
    }

    const user = await userService.createUser(name, surname);
    res.status(201).json(user);
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  }

  async getUserById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return next({
        type: "VALIDATION",
        message: "Validation failed",
        details: ["User ID must be a positive integer"],
      });
    }

    const user = await userService.getUserById(userId);

    if (user == null) {
      return next({
        type: "NOT_FOUND",
        message: `User with id=${userId} not found`,
        details: [],
      });
    }

    res.status(200).json(user);
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { name, surname } = (req.body ?? {}) as {
      name: string;
      surname: string;
    };
    const userId = Number(req.params.id);

    try {
      if (name == null || name === "") {
        errors.push("Name is required");
      } else if (!isAlphabetic(name))
        errors.push("Name can contain English letters only");

      if (surname == null || surname === "") {
        errors.push("Surname is required");
      } else if (!isAlphabetic(surname))
        errors.push("Surname can contain English letters only");

      if (!Number.isInteger(userId) || userId <= 0) {
        errors.push("User ID must be a positive integer");
      }

      if (errors.length > 0) {
        return next({
          type: "VALIDATION",
          message: "Validation failed",
          details: errors,
        });
      }

      const user = await userService.updateUser(userId, name, surname);

      res.status(200).json(user);
    } catch (err: any) {
      if (err.message === "Not found") {
        return next({
          type: "NOT_FOUND",
          message: `User with id=${userId} not found`,
          details: [],
        });
      }
      return next(err);
    }
  }

  async deleteUser(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const errors: string[] = [];
    const userId = Number(req.params.id);

    try {
      if (!Number.isInteger(userId) || userId <= 0) {
        errors.push("User ID must be a positive integer");
      }

      if (errors.length > 0) {
        return next({
          type: "VALIDATION",
          message: "Validation failed",
          details: errors,
        });
      }

      await userService.deleteUser(userId);

      res.status(204).send();
    } catch (err: any) {
      if (err.message === "Not found") {
        return next({
          type: "NOT_FOUND",
          message: `User with id=${userId} not found`,
          details: [],
        });
      }
      return next(err);
    }
  }
}
export default new UserController();
