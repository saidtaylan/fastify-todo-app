import moment from "moment";
import { signJWT, excludeFields } from "./helpers.js";

class Service {
  constructor(knex, userModel, todoModel) {
    this.knex = knex;
    this.userModel = userModel;
    this.todoModel = todoModel;
  }

  addUser(userData) {
    return this.knex.transaction(async (trx) => {
      const user = await this.userModel.insertUser(trx, userData);
      console.log("user", user);
      return user;
    });
  }

  async getTodos(filter) {
    return this.knex.transaction(async (trx) => {
      const todo = await this.todoModel.selectTodo(trx, filter);
      return todo;
    });
  }

  async login(body) {
    return this.knex.transaction(async (trx) => {
      let user = await this.userModel.selectUser(trx, {
        username: body.username,
      });
      if (user.length === 0) {
        throw new Error("user not exist");
      }
      user = user[0];
      if (body.password === user.password) {
        const token = signJWT({ id: user.id });
        return {
          token,
          user: {
            username: user.username,
          },
        };
      }
    });
  }

  addCategory(body) {
    return this.knex.transaction(async (trx) => {
      const newCategory = await this.todoModel.insertCategory(trx, body);
      return newCategory[0] ?? [];
    });
  }

  addTodo(body) {
    return this.knex.transaction(async (trx) => {
      const newTodo = await this.todoModel.insertTodo(trx, body);
      return newTodo[0] ?? [];
    });
  }

  async getUser(cond) {
    return this.knex.transaction(async (trx) => {
      const user = await this.userModel.selectUserWithNoPassword(trx, cond);
      return user[0] ?? [];
    });
  }

  async completeTodo(id) {
    return this.knex.transaction(async (trx) => {
      const todo = await this.todoModel.updateTodo(
        trx,
        { id },
        { status: true }
      );
    });
  }

  async deleteTodo(id) {
    return this.knex.transaction(async (trx) => {
      const todo = await this.todoModel.selectTodo(trx, id);
      if (todo[0].user_id === +id) {
        const deletedTodo = await this.todoModel.updateTodo(
          trx,
          { id },
          { deleted_at: moment().format() }
        );
        if (deletedTodo === 1) {
          return deletedTodo;
        }
      }
      throw new Error("cannot delete not your own todo");
    });
  }

  async uploadThumbnail(todoId, fileName) {
    return this.knex.transaction(async (trx) => {
      await this.todoModel.updateTodo(
        trx,
        { id: todoId },
        { thumbnail: fileName }
      );
    });
  }

  async getTodo(id) {
    return this.knex.transaction(async (trx) => {
      const todo = await this.todoModel.selectTodo(trx, { id });
      return todo[0] ?? null;
    });
  }
  async getCategory(id, deep) {
    return this.knex.transaction(async (trx) => {
      const categories = await this.todoModel.selectCategory(
        trx,
        { "c.id": +id },
        deep
      );
      return categories[0] ?? null;
    });
  }

  async updateTodo(id, data) {
    return this.knex.transaction(async (trx) => {
      const todo = await this.todoModel.selectTodo(trx, id);
      if (todo[0].id === +id) {
        if (data.status) {
          throw new Error("cannot update todo status");
        }
        return this.todoModel.updateTodo(trx, { id }, data);
      }
      throw new Error("cannot update todo that you dont own");
    });
  }
}

export default Service;
