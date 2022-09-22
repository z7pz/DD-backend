export class NotAuthorizedError extends Error {
    constructor() {
      super("User not authorized");
    }
  }