import { FastifyLogFn, FastifyReply, FastifyRequest } from "fastify";
import { assignRoutes } from "../../utils/registries/assignRoutes";
import { Router } from "../Router";
import axios from "axios";
import config from "../../utils/config";

const CLIENT_PAGES = {
  landing: "http://127.0.0.1:5173",
  servers: "http://127.0.0.1:5173/servers",
};

export const jsonToUrlParams = (data: Record<string, any>) => {
  const params = new URLSearchParams();
  for (const key in data) {
    params.append(key, `${data[key]}`);
  }
  return params;
};

export class DiscordOAuthRouter extends Router("/oauth") {
  async "GET /code"(req: FastifyRequest, res: FastifyReply) {
    const code = (req.query as { code?: string })["code"];
    if (code) {
      try {
        const response = await axios.post(
          "https://discord.com/api/oauth2/token",
          jsonToUrlParams({
            client_id: config.discord.id,
            client_secret: config.discord.secret,
            code,
            grant_type: "authorization_code",
            redirect_uri: `http://localhost:${config.server.port}/oauth/code${
              ((req.query as any).goto)
                ? `?goto=${(req.query as any).goto}`
                : ""
            }`,
            scope: "identify",
          })
        );
        if (
          CLIENT_PAGES[(req.query as any).goto as keyof typeof CLIENT_PAGES]
        ) {
          res.redirect(
            CLIENT_PAGES[(req.query as any).goto as keyof typeof CLIENT_PAGES]
          );
        } else {
          res.redirect(CLIENT_PAGES["landing"]);
        }
      } catch (err) {
        console.log(err as any);
      }
    }
  }
  "GET /login"(req: FastifyRequest, res: FastifyReply) {
    const goto = (req.query as any).goto;
    const url = new URL(
      `https://discord.com/api/oauth2/authorize?client_id=${config.discord.id}&response_type=code&scope=identify`
    );
    url.searchParams.append(
      `redirect_uri`,
      `http://localhost:3000/oauth/code${goto && `?goto=${goto}`}`
    );
    res.redirect(url.toString());
  }
}

assignRoutes(DiscordOAuthRouter, []);
