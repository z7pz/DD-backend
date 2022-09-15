import { FastifyReply, FastifyRequest, RequestPayload } from "fastify";
import { assignRoutes } from "../../utils/registries/assignRoutes";
import { Router } from "../Router";

export class DiscordOAuthRouter extends Router("/oauth") {
  "GET /"(req: RequestPayload, res: FastifyReply) {
  }
  "GET /code"(req: FastifyRequest, res: FastifyReply) {
  }
}

assignRoutes(DiscordOAuthRouter, []);
