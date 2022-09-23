import { FastifyReply, FastifyRequest } from "fastify";
import { get_guilds } from "../../utils/get_guilds";
import { decrypt } from "../../utils/crypto";

export class GuildsRoute {
  async "GET /guilds"(req: FastifyRequest, res: FastifyReply) {
    const guilds = await get_guilds(decrypt(req.session.token));
    res.send(guilds);
  }
}
