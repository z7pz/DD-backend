import { client } from "..";

export async function get_user(user_id: string) {
    const user = await client.users.fetch(user_id);
    return user;
  }