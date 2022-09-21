import { FastifyInstance } from "fastify";
import { route_validator } from "../routes_validator";
const dontInclude = ["basePath", "prisma"];
export function registerRouter(router: any, server: FastifyInstance) {
  let obj = router;
  let methods: any[] = [];
  do {
    const l = Object.getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertySymbols(obj).map((s) => s.toString()))
      .sort()
      .filter(
        (p, i, arr) =>
          !dontInclude.includes(p) &&
          p !== "constructor" &&
          (i == 0 || p !== arr[i - 1]) &&
          methods.indexOf(p) === -1
      );
    methods = methods.concat(l);
  } while ((obj = Object.getPrototypeOf(obj)) && Object.getPrototypeOf(obj));
  for (let i = 0; i < methods.length; i++) {
    try {
      const [method, route] = route_validator(methods[i]);
      console.log(methods[i]);
      server[method.toLowerCase() as "get"](
        `${router.basePath}${route == "/" ? "" : route}`,
        router[methods[i]]
      );
    } catch (err) {
      console.log((<TypeError>err).message);
    }
  }
}
