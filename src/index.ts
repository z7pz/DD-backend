import { FastifyInstance, FastifyReply, InjectOptions } from "fastify";
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
import ExpressPlugin from "@fastify/express";
import { FastifyRequest } from "fastify";
import { NotAuthorizedError } from "./utils/errors/Authorization";
import { doesNotMatch } from "assert";
const prisma = new PrismaClient();
MemoryStore;
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
  await fastify.register(ExpressPlugin);
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
    next()
  });
};
let options = { logger: true };
export { prisma, options };
export default bootstrap;
