import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
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
    res.status(200).json(user);
  };

  updateUser = async (
    req: Request<{ userId: string }, {}, userDTO>,
    res: Response
  ) => {
    const user = await userService.updateUser(
      Number(req.params.userId),
      req.body
    );
    res.status(200).json(user);
  };

  deleteUser = async (req: Request<{ userId: string }>, res: Response) => {
    await userService.deleteUser(Number(req.params.userId));
    res.status(204).send();
  };
}
export default new UserController();
