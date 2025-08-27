// user.controller.js

const db = require("../db");

class UserController {
  async createUser(req, res) {
    const { name, surname } = req.body;
    console.log(name, surname);

    const newUser = await db.query(
      "INSERT INTO users (name, surname) values ($1, $2) RETURNING *",
      [name, surname]
    );
    res.json(newUser.rows[0]);
  }

  async getUsers(req, res) {
    const users = await db.query("SELECT * FROM users");
    res.json(users.rows);
  }

  async getOneUser(req, res) {
    const id = req.params.id;
    const user = await db.query("SELECT * FROM users where id = $1", [id]);
    res.json(user.rows[0]);
  }

  async updateUser(req, res) {
    const { id, name, surname } = req.body;
    const user = await db.query(
      "UPDATE users set name = $1, surname = $2 where id = $3 RETURNING *",
      [name, surname, id]
    );
    res.json(user.rows[0]);
  }

  async deleteUser(req, res) {
    const id = req.params.id;
    const user = await db.query("DELETE FROM users where id = $1", [id]);
    res.json(user.rows[0]);
  }
}

module.exports = new UserController();
