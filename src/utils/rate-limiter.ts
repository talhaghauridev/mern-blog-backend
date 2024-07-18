import { Info } from "@/types";
import { Context } from "./context";
import ApolloError from "./ApolloError";
import { ErrorTypes } from "@/constants/ErrorTypes";

export class RateLimiter {
  private limit: number;
  private windowMs: number;
  private clients: Map<string, { count: number; firstRequestTime: number }>;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.clients = new Map();
  }

  private getClientKey(req: any): string {
    console.log(req.ip);

    return req.ip;
  }

  public isRateLimited(req: any): boolean {
    const clientKey = this.getClientKey(req);
    const currentTime = Date.now();

    if (!this.clients.has(clientKey)) {
      this.clients.set(clientKey, { count: 1, firstRequestTime: currentTime });
      return false;
    }

    const clientData = this.clients.get(clientKey)!;
    const timePassed = currentTime - clientData.firstRequestTime;

    if (timePassed > this.windowMs) {
      this.clients.set(clientKey, { count: 1, firstRequestTime: currentTime });
      return false;
    }

    if (clientData.count < this.limit) {
      clientData.count += 1;
      return false;
    }

    return true;
  }
}

const rateLimiter = new RateLimiter(100, 15 * 60 * 1000);

export const rateLimitedResolver = (resolver: any) => {
  return (parent: any, args: any, context: Context, info: Info) => {
    if (rateLimiter.isRateLimited(context.req)) {
      return ApolloError(
        "Too many requests, Please try again later.",
        ErrorTypes.TOO_MANY_REQUESTS
      );
    }
    return resolver(parent, args, context, info);
  };
};
