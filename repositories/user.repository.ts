import db from "../db";

class UserRepository {
  async createUser(name: string, surname: string) {
    const newUser = await db.query(
      "INSERT INTO users (name, surname) VALUES ($1, $2) RETURNING *",
      [name, surname]
    );
    return newUser.rows[0];
  }

  async getAllUsers() {
    const users = await db.query("SELECT * FROM users");
    return users.rows;
  }

  async getUserById(userId: number) {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    return user.rows[0];
  }

  async updateUser(userId: number, name: string, surname: string) {
    const user = await db.query(
      "UPDATE users SET name = $1, surname = $2 WHERE id = $3 RETURNING *",
      [name, surname, userId]
    );
    return user.rows[0];
  }

  async deleteUser(userId: number) {
    await db.query("DELETE FROM users WHERE id = $1", [userId]);
  }
}

export default new UserRepository();
