import { assignRoutes } from "../../utils/registries/assignRoutes";
import { Router } from "../Router";

export class DiscordOAuthRouter extends Router("/oauth") {
  "GET /"(req: Request, res: any) {
    res.send("oauth");
  }
  "GET /code"(req: Request, res: any) {
    res.send("code");
  }
}

assignRoutes(DiscordOAuthRouter, []);
