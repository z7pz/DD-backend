import { FastifyReply, FastifyRequest } from "fastify";
import { Route } from "../../../utils/decorators/Route";
@Route({ prefix: "/guild" })
export class GuildLanguageRoute {
  "GET /language"(req: FastifyRequest, res: FastifyReply) {
    res.send("test");
  }
}
