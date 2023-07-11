import db from "../db.js";

class TodoModel {
  constructor(db) {
    this.db = db;
  }

  async insertCategory(trx, category) {
    const newCat = await this.db("categories")
      .insert(category)
      .transacting(trx);
    return newCat;
  }

  async selectCategory(trx, id) {
    const category = await this.db("categories").where({ id }).transacting(trx);
    return category;
  }

  async insertTodo(trx, todo) {
    const newTodo = await this.db("todos").insert(todo).transacting(trx);
    return newTodo;
  }

  async selectTodo(trx, cond) {
    const todo = await db("todos")
      .where(cond)
      .whereNull("deleted_at")
      .transacting(trx);
    return todo;
  }
  async selectTodoInRange(trx, cond, column, range) {
    const todo = await db("todos")
      .where(cond)
      .whereBetween(column, range)
      .whereNull("deleted_at")
      .transacting(trx);
    return todo;
  }

  async updateTodo(trx, cond, data) {
    const updatedTodo = await db("todos")
      .where(cond)
      .update(data)
      .transacting(trx);
    return updatedTodo;
  }

  async selectCategory(trx, cond, deep) {
    if (deep) {
      const category = await db("categories as c")
        .where(cond)
        .leftJoin("todos as t", "t.category_id", "=", "c.id")
        .whereNull("t.deleted_at")
        .transacting(trx);
      return category;
    }
    const category = await db("categories").where(cond).transacting(trx);
    return category;
  }
}

export default TodoModel;
