import { FastifyReply, FastifyRequest } from "fastify";
import { Router } from "../../../utils/decorators/Router";
@Router({ prefix: "/guild" })
export class GuildLanguageRoute {
  "GET /language"(req: FastifyRequest, res: FastifyReply) {
    res.send("test");
  }
}
