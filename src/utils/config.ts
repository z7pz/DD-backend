import "dotenv/config";
import env from "env-var";

function validate_secret(secret: string) {
  if(secret.length < 32) throw Error("SECRET SHOULD BE 32 OR MORE")
  return secret
}

export const config = {
  secret: validate_secret(env.get("SECRET").required().asString()),
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
