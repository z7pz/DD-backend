import { FastifyReply, FastifyRequest } from "fastify";
import Crypto from "crypto-js";
import config from "../../utils/config";
import { IGuild } from "../../utils/interfaces/guild";
import axios from "axios";
import { client } from "../..";
async function get_user_guilds(access_token: string) {
  const res = await axios.get<IGuild[]>(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
}

async function filter_guilds(guilds: IGuild[]) {
  return guilds.filter(
    (guild) =>
      client.guilds.cache.has(guild.id) && (guild.permissions & 0x8) == 0x8
  ); // 0x8 === "ADMINSTRATOR"
}

export class GuildsRoute {
  async "GET /guilds"(req: FastifyRequest, res: FastifyReply) {
    const access_token = Crypto.AES.decrypt(
      req.session.token as string,
      config.secret
    ).toString(Crypto.enc.Utf8);
    const user_guilds = await get_user_guilds(access_token);
    const guilds = await filter_guilds(user_guilds);
    res.send(guilds);
  }
}
