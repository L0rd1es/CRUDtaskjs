const db = require("../db");

class UserRepository {
  async createUser(name, surname) {
    const newUser = await db.query(
      "INSERT INTO users (name, surname) values ($1, $2) RETURNING *",
      [name, surname]
    );
    return newUser.rows[0];
  }

  async getUsers() {
    const users = await db.query("SELECT * FROM users");
    return users.rows;
  }

  async getOneUser(id) {
    const user = await db.query("SELECT * FROM users where id = $1", [id]);
    return user.rows[0];
  }

  async updateUser(id, name, surname) {
    const user = await db.query(
      "UPDATE users set name = $1, surname = $2 where id = $3 RETURNING *",
      [name, surname, id]
    );
    return user.rows[0];
  }

  async deleteUser(id) {
    const user = await db.query("DELETE FROM users where id = $1", [id]);
    return user.rows[0];
  }
}

module.exports = new UserRepository();
