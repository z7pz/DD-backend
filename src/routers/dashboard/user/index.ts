import { FastifyReply, FastifyRequest } from "fastify";

export class UserRoute {
  "POST /user"(req: FastifyRequest, res: FastifyReply) {
    // console.log(<any>req.session);
    if (req.session.token) {
      res.send({ test: "erw" });
    } else {
      res.status(400);
      res.send("User not authorized");
    }
  }
}
