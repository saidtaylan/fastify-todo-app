import knex from "./db.js";
import Controller from "./controller.js";
import Service from "./service.js";
import UserModel from "./models/user.js";
import TodoModel from "./models/todo.js";
import multer from "fastify-multer";

class Module {
  models = {};

  constructor(fastify) {
    this.startModels();
    fastify.register(multer.contentParser);
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
          cb(new Error("file mime type must be jpeg or png"), "");
        }
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
      },
    });
    this.multer = multer({ storage });
    this.service = new Service(knex, this.models.user, this.models.todo);
    this.controller = new Controller(fastify, this.service, this.multer);
  }

  startModels() {
    this.models.user = new UserModel(knex);
    this.models.todo = new TodoModel(knex);
  }
}

export default Module;
