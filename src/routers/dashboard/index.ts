import { assignRoutes } from "../../utils/registries/assignRoutes";
import { Router } from "../Router";
import { GuildLanguageRoute } from "./guild/language";
import { GuildPrefixRoute } from "./guild/prefix";
import { UserRoute } from "./user";

export class DashboardRouter extends Router("/dashboard") {

}

assignRoutes(DashboardRouter, [GuildLanguageRoute, GuildPrefixRoute, UserRoute])