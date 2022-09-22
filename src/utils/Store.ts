import FastifySessionPlugin from "@fastify/session";
import { PrismaClient } from "@prisma/client";
import { Session } from "fastify";

export class Store implements FastifySessionPlugin.SessionStore {
  constructor(public prisma: PrismaClient) {}
  async set(sessionId: string, session: any, callback: (err?: Error) => void) {
    try {
      const data = await this.prisma.session.findUnique({
        where: {
          sessionId,
        },
      });
      if (!data) {
        await this.prisma.session.create({
          data: {
            session: JSON.stringify(session),
            sessionId,
          },
        });
      } else {
        await this.prisma.session.update({
          where: {
            sessionId,
          },
          data: {
            session: JSON.stringify(session),
          },
        });
      }
      callback();
    } catch (err: any) {
      callback(err);
    }
  }

  get(
    sessionId: string,
    callback: (err: Error | null, result: Session) => void
  ): void {
    this.prisma.session
      .findUnique({
        where: {
          sessionId,
        },
      })
      .then((res) => {
        if (res) {
          console.log("data");
          callback(null, JSON.parse(res!.session));
        } else {
          console.log("err");
          callback(null, null as unknown as Session);
        }
      })
      .catch((err) => {
        console.log("err");
        callback(null, null as unknown as Session);
      });
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
