import Fastify from "fastify";
import Module from "./module.js";
import qs from "querystring";

const fastify = Fastify({
  logger: true,
  querystringParser: (str) => qs.parse(str),
});

const module = new Module(fastify);

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
