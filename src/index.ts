import fastify from "fastify";

import { DiscordOAuthRouter } from "./routers/oauth";
import config from "./utils/config";
import { registerRouter } from "./utils/registries/registerRouter";
 
const server = fastify();
registerRouter(new DiscordOAuthRouter(), server);
server.listen({ port: config.server.port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
