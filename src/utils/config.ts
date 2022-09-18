import "dotenv/config";
import env from "env-var";
export const config = {
  discord: {
    token: env.get("DISCORD_TOKEN").required().asString(),
    secret: env.get("DISCORD_SECRET").required().asString(),
    id: env.get("DISCORD_ID").required().asString(),
  },
  server: {
    port: env.get("PORT").default(3000).asPortNumber(),
  },
};
export default config;
