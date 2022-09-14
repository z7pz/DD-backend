import { FastifyInstance } from "fastify";
const dontInclude = ["basePath"];
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
    const [method, route] = methods[i].split(/(?<=^\S+)\s/) as string[];
    server[(method.toLowerCase()) as "get"](
      `${router.basePath}${route == "/" ? "" : route}`,
      router[methods[i]]
    );
  }
}
