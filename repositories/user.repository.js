const db = require("../db");

class UserRepository {
  async createUser(name, surname) {
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

  async getUserById(userId) {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    return user.rows[0];
  }

  async updateUser(userId, name, surname) {
    const user = await db.query(
      "UPDATE users SET name = $1, surname = $2 WHERE id = $3 RETURNING *",
      [name, surname, userId]
    );
    return user.rows[0];
  }

  async deleteUser(userId) {
    await db.query("DELETE FROM users WHERE id = $1", [userId]);
  }
}

module.exports = new UserRepository();
