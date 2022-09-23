import axios from "axios";
import { client } from "..";
import { IGuild } from "./interfaces/guild";

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

export async function get_guilds(access_token: string) {
  return (await get_user_guilds(access_token)).filter(
    (guild) =>
      client.guilds.cache.has(guild.id) && (guild.permissions & 0x8) == 0x8
  ); // 0x8 === "ADMINSTRATOR"
}
