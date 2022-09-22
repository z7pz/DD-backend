import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../..";

export class UserRoute {
  async "POST /user"(req: FastifyRequest, res: FastifyReply) {
    try {
      if (req.session.token) {
        const oauth = await prisma.auth.findUnique({
          where: { access_token: req.session.token },
        });
        if (!oauth) throw new NotAuthorizedError();
        res.status(200)
        res.send(oauth)
      } else {
        throw new NotAuthorizedError();
      }
    } catch (err) {
      res.status(401);  
      res.send((<NotAuthorizedError>err).message || 'wtf');
    }
  }
}
class NotAuthorizedError extends Error {
  constructor() {
    super("User not authorized");
  }
}
