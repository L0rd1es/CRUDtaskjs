import db from "../db";
import { userDTO } from "../DTO/user.dto";
import { AppError, AppErrorType } from "../errors/appError";

class UserRepository {
  async createUser(dto: userDTO) {
    const newUser = await db.query(
      "INSERT INTO users (name, surname) VALUES ($1, $2) RETURNING *",
      [dto.name, dto.surname]
    );
    return newUser.rows[0];
  }

  async getAllUsers() {
    const users = await db.query("SELECT * FROM users");
    return users.rows;
  }

  async getUserById(userId: number) {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (user.rowCount === 0) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `User with id:${userId} not found`,
        404
      );
    }

    return user.rows[0];
  }

  async updateUser(userId: number, dto: userDTO) {
    const user = await db.query(
      "UPDATE users SET name = $1, surname = $2 WHERE id = $3 RETURNING *",
      [dto.name, dto.surname, userId]
    );

    if (user.rowCount === 0) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `User with id:${userId} not found`,
        404
      );
    }

    return user.rows[0];
  }

  async deleteUser(userId: number) {
    await db.query("DELETE FROM users WHERE id = $1", [userId]);
  }
}

export default new UserRepository();
