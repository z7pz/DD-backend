import { FastifyReply, FastifyRequest } from "fastify";
import { Router } from "../../../utils/decorators/Router";
@Router({ prefix: "/guild" })
export class GuildLanguageRoute {
  "POST /language"(req: FastifyRequest, res: FastifyReply) {
  }
}
