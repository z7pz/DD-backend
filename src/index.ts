import { FastifyInstance, InjectOptions } from "fastify";
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
const prisma = new PrismaClient();
MemoryStore
const bootstrap = async (
  fastify: FastifyInstance,
  _options: unknown,
  _next: () => void
) => {
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
  registerRouter(new DashboardRouter(), fastify);
};
let options = { logger: true };
export { prisma, options };
export default bootstrap;
