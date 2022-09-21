export function route_validator(name: string) {
  const exp = /(GET|POST)\s?(\/?.+)/;
  const matchs = name.match(exp);
  if (!matchs || !exp.test(name)) throw new Error("Invalid Route: " + name);
  let [, method, route] = matchs;
  return [ method, route ];
}
