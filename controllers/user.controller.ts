import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { isAlphabetic } from "../utils/validation.isAlphabetic";
import { AppError, AppErrorType } from "../errors/appError";
import { userDTO } from "../DTO/user.dto";

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { name, surname } = req.body as userDTO;

    if (name == null || name === "") {
      errors.push("Name is required");
    } else if (!isAlphabetic(name))
      errors.push("Name can contain English letters only");

    if (surname == null || surname === "") {
      errors.push("Surname is required");
    } else if (!isAlphabetic(surname))
      errors.push("Surname can contain English letters only");

    if (errors.length > 0) {
      throw new AppError(
        AppErrorType.VALIDATION,
        `Validation failed: ${errors}`,
        400
      );
    }

    const user = await userService.createUser(req.body as userDTO);
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
      throw new AppError(
        AppErrorType.VALIDATION,
        `User ID must be a positive integer`,
        400
      );
    }

    const user = await userService.getUserById(userId);

    if (user == null) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `User with Id:${req.params.id} not found`,
        404
      );
    }

    res.status(200).json(user);
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];

    const { name, surname } = req.body as userDTO;
    const userId = Number(req.params.id);

    if (name == null || name === "") {
      errors.push("Name is required");
    }
    if (!isAlphabetic(name)) {
      errors.push("Name can contain English letters only");
    }
    if (surname == null || surname === "") {
      errors.push("Surname is required");
    }
    if (!isAlphabetic(surname)) {
      errors.push("Surname can contain English letters only");
    }
    if (!Number.isInteger(userId) || userId <= 0) {
      errors.push("User ID must be a positive integer");
    }

    if (errors.length > 0) {
      throw new AppError(
        AppErrorType.VALIDATION,
        `Validation failed: ${errors}`,
        400
      );
    }

    if ((await userService.getUserById(userId)) == null) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `User with Id:${req.params.id} not found`,
        404
      );
    }

    const user = await userService.updateUser(userId, req.body as userDTO);

    res.status(200).json(user);
  }

  async deleteUser(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const errors: string[] = [];
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      errors.push("User ID must be a positive integer");
    }

    if (errors.length > 0) {
      throw new AppError(
        AppErrorType.VALIDATION,
        `Validation failed: ${errors}`,
        400
      );
    }

    if ((await userService.getUserById(userId)) == null) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `User with Id:${req.params.id} not found`,
        404
      );
    }

    await userService.deleteUser(userId);

    res.status(204).send();
  }
}
export default new UserController();
