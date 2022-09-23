import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../..";
import { decrypt } from "../../../utils/crypto";
import { get_user } from "../../../utils/get_user";

export class UserRoute {
  async "GET /user"(req: FastifyRequest, res: FastifyReply) {
    const data = await prisma.auth.findUnique({
      where: {
        access_token: req.session.token,
      },
    });
    console.log(data)
    if (data) {
      const user = await get_user(data.user_id);
      res.send(user);
    }
  }
}
