import FastifySessionPlugin from "@fastify/session";
import { PrismaClient } from "@prisma/client";
import { Session } from "fastify";

export class Store implements FastifySessionPlugin.SessionStore {
  constructor(public prisma: PrismaClient) {}
  async set(sessionId: string, session: any, callback: (err?: Error) => void) {
    try {
      const s = await this.prisma.session.upsert({
        create: {
          sessionId,
          session: JSON.stringify(session),
        },
        where: {
          sessionId,
        },
        update: {
          session: JSON.stringify(session),
        },
      });
      callback();
    } catch (err: any) {
      callback(err);
    }
  }

  async get(
    sessionId: string,
    callback: (err: Error | null, result: Session) => void
  ): Promise<void> {
    try {
      const res = await this.prisma.session.findUnique({
        where: {
          sessionId,
        },
      });
      if (res) {
        callback(null, JSON.parse(res!.session));
      } else {
        //@ts-ignore
        callback();
      }
    } catch (err) {
      //@ts-ignore
      callback();
    }
  }

  destroy(sessionId: string, callback: (err?: Error) => void) {
    this.prisma.session
      .delete({
        where: {
          sessionId,
        },
      })
      .then(() => {
        callback();
      })
      .catch(callback);
  }
}
