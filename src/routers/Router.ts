export function Router(basePath: string = "/") {
  return class {
    basePath = basePath || "/";
  };
}
