import { FastifyReply, FastifyRequest } from "fastify";
import { assignRoutes } from "../../utils/registries/assignRoutes";
import { Router } from "../Router";
import axios from "axios";
import Crypto from "crypto-js";
import config from "../../utils/config";
import { prisma } from "../../index";
import { CLIENT_PAGES } from "../../utils/constants";

interface AuthResponseData {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

export const jsonToUrlParams = (data: Record<string, any>) => {
  const params = new URLSearchParams();
  for (const key in data) {
    params.append(key, `${data[key]}`);
  }
  return params;
};
const gerUser = async (access_token: string) => {
  console.log(access_token.toString());
  const res = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${access_token.toString()}`,
    },
  });
  return res.data;
};

export class DiscordOAuthRouter extends Router("/oauth") {
  constructor() {
    super();
  }
  async "GET /code"(req: FastifyRequest, res: FastifyReply) {
    const code = (req.query as { code?: string })["code"];
    if (code) {
      try {
        const {
          data: { refresh_token, access_token },
        } = await axios.post<AuthResponseData>(
          "https://discord.com/api/oauth2/token",
          jsonToUrlParams({
            client_id: config.discord.id,
            client_secret: config.discord.secret,
            code,
            grant_type: "authorization_code",
            redirect_uri: `http://localhost:${config.server.port}/oauth/code${
              (req.query as any).goto ? `?goto=${(req.query as any).goto}` : ""
            }`,
            scope: "identify",
          })
        );
        let encrypted = {
          access_token: Crypto.AES.encrypt(
            access_token,
            config.secret
          ).toString(),
          refresh_token: Crypto.AES.encrypt(
            refresh_token,
            config.secret
          ).toString(),
        };
        const user = await gerUser(access_token);
        const OAuth2User = await prisma.auth.findUnique({
          where: { user_id: user.id },
        });
        if (OAuth2User) {
          await prisma.auth.update({
            where: { user_id: user.id },
            data: {
              access_token: { set: encrypted.access_token },
              refresh_token: { set: encrypted.refresh_token },
            },
          });
        } else {
          await prisma.auth.create({
            data: {
              user_id: user.id,
              access_token: encrypted.access_token,
              refresh_token: encrypted.refresh_token,
            },
          });
        }
        req.session.token = encrypted.access_token;
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
      `http://localhost:3000/oauth/code${goto ? `?goto=${goto}` : ""}`
    );
    res.redirect(url.toString());
  }
}

assignRoutes(DiscordOAuthRouter, []);
