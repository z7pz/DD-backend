let execlude = ["constructor"];
interface Options {
  prefix?: string;
  suffix?: string;
}
export function Route({ prefix = "", suffix = "" }: Options) {
  return (target: any) => {
    const methodNames = Reflect.ownKeys(target.prototype).filter(
      (e) => !execlude.includes(e as string)
    );
    methodNames.forEach((method) => {
      let fun = Reflect.getOwnPropertyDescriptor(target.prototype, method);
      Reflect.deleteProperty(target.prototype, method);
      const [method_type, route] = (<string>method).split(
        /(?<=^\S+)\s/
      ) as string[];
      let newName = `${method_type} ${prefix}${route}${suffix}`;
      Reflect.defineProperty(target.prototype, newName, {
        value: fun?.value,
      });
    });

    return target;
  };
}
