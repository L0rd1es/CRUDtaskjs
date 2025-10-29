import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { AppError, AppErrorType } from "../errors/appError";
import { userDTO } from "../DTO/user.dto";

class UserController {
  createUser = async (req: Request<{}, {}, userDTO>, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  };

  getAllUsers = async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  };

  getUserById = async (req: Request<{ userId: string }>, res: Response) => {
    const user = await userService.getUserById(Number(req.params.userId));

    if (!user) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `User with Id:${req.params.userId} not found`,
        404
      );
    }

    res.status(200).json(user);
  };

  updateUser = async (
    req: Request<{ userId: string }, {}, userDTO>,
    res: Response
  ) => {
    const userId = Number(req.params.userId);

    if (!(await userService.getUserById(userId))) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `User with Id:${req.params.userId} not found`,
        404
      );
    }

    const user = await userService.updateUser(userId, req.body);

    res.status(200).json(user);
  };

  deleteUser = async (req: Request<{ userId: string }>, res: Response) => {
    const userId = Number(req.params.userId);

    if (!(await userService.getUserById(userId))) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `User with Id:${req.params.userId} not found`,
        404
      );
    }

    await userService.deleteUser(userId);

    res.status(204).send();
  };
}
export default new UserController();
