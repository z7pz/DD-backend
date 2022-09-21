import { Router } from "./Router";

export class MainRouter extends Router("/") {
    "GET /"(req: any, res: any) {
        res.send("OK")
    } 
}