import { FastifyReply, FastifyRequest } from "fastify";
import Crypto from "crypto-js";
import config from "../../utils/config";
import axios from "axios";
import { IGuild } from "../../utils/interfaces/guild";
async function get_guilds(access_token) {
  console.log(access_token);
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
  return guilds.filter((guild) => (guild.permissions & 0x8) == 0x8); // 0x8 === "ADMINSTRATOR"
}

export class GuildsRoute {
  async "GET /guilds"(req: FastifyRequest, res: FastifyReply) {
    const access_token = Crypto.AES.decrypt(
      req.session.token as string,
      config.secret
    ).toString(Crypto.enc.Utf8);
    // console.log(req.session.token)
    const guilds = await get_guilds(access_token);
    const new_guilds = await filter_guilds(guilds);
    res.send(new_guilds);
  }
}
