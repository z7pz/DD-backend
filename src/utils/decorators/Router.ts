import { route_validator } from "../routes_validator";

let execlude = ["constructor"];
interface Options {
  prefix?: string;
  suffix?: string;
}
export function Router({ prefix = "", suffix = "" }: Options): ClassDecorator {
  return (target) => {
    const methodNames = Reflect.ownKeys(target.prototype).filter(
      (e) => !execlude.includes(<string>e)
    );
    methodNames.forEach((method) => {
      try {
        let fun = Reflect.getOwnPropertyDescriptor(target.prototype, method);
        const [method_type, route] = route_validator(<string>method);
        let newName = `${method_type} ${prefix}${route}${suffix}`;
        Reflect.deleteProperty(target.prototype, method);
        Reflect.defineProperty(target.prototype, newName, {
          value: fun?.value,
        });
      } catch (err) {
        // console.log((<TypeError>err).message);
      }
    });

    return target;
  };
}
