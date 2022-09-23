import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { DiscordOAuthRouter } from "./routers/oauth";
import { DashboardRouter } from "./routers/dashboard";
import { registerRouter } from "./utils/registries/registerRouter";
import FastifySessionPlugin, { MemoryStore } from "@fastify/session";
import FastifyCookiePlugin from "@fastify/cookie";
import cors from "@fastify/cors";
import config from "./utils/config";
import { Store } from "./utils/Store";
import { MainRouter } from "./routers/Main";
import { NotAuthorizedError } from "./utils/errors/Authorization";
import Discord from "discord.js";
const prisma = new PrismaClient();
const client = new Discord.Client({
  intents: ["GuildMembers", "Guilds"],
});
MemoryStore;
const bootstrap = async (
  fastify: FastifyInstance,
  _options: unknown,
  _next: () => void
) => {
  client.login(config.discord.token);
  client.on("ready", async () => {
    console.log(client.user?.tag);
  });
  fastify.register(cors, {
    origin: "*",
    credentials: true,
    logLevel: "debug",
  });
  fastify.register(FastifyCookiePlugin);
  fastify.register(FastifySessionPlugin, {
    cookieName: "dd-bot-session",
    secret: config.secret,
    store: new Store(prisma),
    cookie: { secure: false },
  });
  registerRouter(new MainRouter(), fastify);
  registerRouter(new DiscordOAuthRouter(), fastify);
  await fastify.register((fastify, options, next) => {
    fastify.addHook("onRequest", async (req, res) => {
      if (req.session.token) {
        const oauth = await prisma.auth.findUnique({
          where: { access_token: req.session.token },
        });
        if (!oauth) throw new NotAuthorizedError();
      } else {
        throw new NotAuthorizedError();
      }
    });
    registerRouter(new DashboardRouter(), fastify);
    next();
  });
};
let options = { logger: true };
export { prisma, client, options };
export default bootstrap;
