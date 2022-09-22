import { FastifyReply, FastifyRequest } from "fastify";
import { Router } from "../../../utils/decorators/Router";
@Router({ prefix: "/guild" })
export class GuildPrefixRoute {
  "GET /:id/prefix"(req: FastifyRequest, res: FastifyReply) {
    res.send('test')
  }
  "POST /:id/prefix"(req: FastifyRequest, res: FastifyReply) {
    res.send('test')
  }
  "POST /:id/prefix/default"(req: FastifyRequest, res: FastifyReply) {
    res.send('test')
  }
}
