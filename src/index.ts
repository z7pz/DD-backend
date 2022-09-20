import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { DiscordOAuthRouter } from "./routers/oauth";
import { DashboardRouter } from "./routers/dashboard";
import { registerRouter } from "./utils/registries/registerRouter";
const prisma = new PrismaClient();
const bootstrap = async (
  fastify: FastifyInstance,
  _options: unknown,
  _next: () => void
) => {
  registerRouter(new DiscordOAuthRouter(), fastify);
  registerRouter(new DashboardRouter(), fastify);
};
export { prisma };
export default bootstrap;
