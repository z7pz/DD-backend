import { FastifyReply, FastifyRequest } from "fastify";
import { Route } from "../../../utils/decorators/Route";
@Route({ prefix: "/guild" })
export class GuildPrefixRoute {
  "GET /prefix"(req: FastifyRequest, res: FastifyReply) {}
}
