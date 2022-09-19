import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { DiscordOAuthRouter } from "./routers/oauth";
import { registerRouter } from "./utils/registries/registerRouter";
const prisma = new PrismaClient();
const bootstrap = async (
  fastify: FastifyInstance,
  _options: unknown,
  next: () => void
) => {
  registerRouter(new DiscordOAuthRouter(), fastify);
};
export { prisma };
export default bootstrap;
