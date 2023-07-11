import { authenticate } from "./middlewares/auth.js";

class Controller {
  constructor(fastify, service, multer) {
    this.fastify = fastify;
    this.service = service;
    this.uploader = multer;
    this.setRoutes();
  }

  setRoutes() {
    this.fastify.post("/users", this.addUser.bind(this));

    this.fastify.get(
      "/users/:id",
      { onRequest: [authenticate] },
      this.getUser.bind(this)
    );

    this.fastify.post("/login", this.login.bind(this));

    this.fastify.post(
      "/categories",
      { onRequest: [authenticate] },
      this.addCategory.bind(this)
    );

    this.fastify.get(
      "/todos",
      {
        onRequest: [authenticate],
      },
      this.getTodos.bind(this)
    );

    this.fastify.post(
      "/todos",
      { onRequest: [authenticate] },
      this.addTodo.bind(this)
    );

    this.fastify.patch(
      "/todos/:id/complete",
      { onRequest: [authenticate] },
      this.completeTodo.bind(this)
    );

    this.fastify.delete(
      "/todos/:id",
      { onRequest: [authenticate] },
      this.deleteTodo.bind(this)
    );
    this.fastify.post(
      "/todos/:id/upload",
      {
        preHandler: this.uploader.single("thumbnail"),
      },
      this.uploadThumbnail.bind(this)
    );

    this.fastify.get(
      "/todos/:id",
      { onRequest: [authenticate] },
      this.getTodo.bind(this)
    );
    this.fastify.get(
      "/categories/:id",
      { onRequest: [authenticate] },
      this.getCategory.bind(this)
    );

    this.fastify.put(
      "/todos/:id",
      {
        onRequest: [authenticate],
      },
      this.updateTodo.bind(this)
    );
  }
  0;
  async getUser(req, reply) {
    const id = req.params["id"];
    const user = await this.service.getUser({ id });
    reply.send(user);
  }

  async getTodos(req, reply) {
    const todos = await this.service.getTodos();
    reply.send(todos);
  }

  async addUser(req, reply) {
    const newUser = await this.service.addUser(req.body);
    reply.send(newUser);
  }

  async login(req, reply) {
    const data = await this.service.login(req.body);
    reply.send(data);
  }

  async addCategory(req, reply) {
    const userId = req.user.id;
    const category = await this.service.addCategory({
      ...req.body,
      user_id: userId,
    });
    reply.send(category);
  }

  async addTodo(req, reply) {
    const category = await this.service.addTodo({
      ...req.body,
      user_id: req.user.id,
    });
    reply.send(category);
  }

  async completeTodo(req, reply) {
    await this.service.completeTodo(req.params.id);
    reply.send({ status: true });
  }

  async updateTodo(req, reply) {
    await this.service.updateTodo(req.params.id);
    reply.send({ status: true });
  }

  async deleteTodo(req, reply) {
    await this.service.deleteTodo(req.params.id);
    reply.send({ status: true });
  }

  async uploadThumbnail(req, reply) {
    const todoId = req.params.id;
    await this.service.uploadThumbnail(todoId, req.file.filename);
    reply.send({ status: true });
  }

  async getTodo(req, reply) {
    const todo = await this.service.getTodo({ id: req.params.id });
    reply.send(todo);
  }
  async getCategory(req, reply) {
    const category = await this.service.getCategory(req.params.id, true);
    reply.send(category);
  }

  async updateTodo(req, reply) {
    await this.service.updateTodo(req.params.id, req.body);
    reply.send({ status: true });
  }
}

export default Controller;
