import db from "../db.js";

class UserModel {
  constructor(db) {
    this.db = db;
  }

  async insertUser(trx, user) {
    const newUser = await db("users").insert(user).transacting(trx);
    return newUser;
  }

  async selectUser(trx, cond) {
    const user = await db("users").where(cond).transacting(trx);
    return user;
  }

  async selectUserWithNoPassword(trx, cond) {
    const user = await db("users")
      .where(cond)
      .transacting(trx)
      .select("username", "id");
    return user;
  }
}

export default UserModel;
