import { FastifyReply, FastifyRequest } from "fastify";
import { Router } from "../../../utils/decorators/Router";
@Router({ prefix: "/guild" })
export class GuildPrefixRoute {
  "GET /prefix"(req: FastifyRequest, res: FastifyReply) {
    res.send("TEST");
  }
}
