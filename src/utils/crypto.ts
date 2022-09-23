import crypto from "crypto-js";
import config from "./config";
const KEY = config.secret;
export function decrypt(hash: string) {
  return crypto.AES.decrypt(hash, KEY).toString(crypto.enc.Utf8);
}
export function encrypt(hash: string) {
  return crypto.AES.encrypt(hash, KEY).toString();
}

export { crypto };
