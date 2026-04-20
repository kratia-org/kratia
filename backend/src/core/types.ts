import type { JwtPayload } from "jsonwebtoken";
import type { NewError } from "./error";
import type { Events } from "./events";

export type Context = {
  request: Request,
  headers: Headers,
  pathname: string,
  method: string,
  body: () => Promise<unknown>,
  query: Record<string, string | Record<string, string>[]>,
  params: Record<string, string | undefined>,
  json: (status: number, body?: any) => Response,
  error: (status: number, message?: string) => NewError,
  shared: Record<string, any> | null,
  events: Events | null
};

export type RequestResponse = {
  status: number,
  data?: any
}

export type RequestHandler = (ctx: Context) => Promise<unknown | RequestResponse>;

export type EndpointResponse = {
  errors?: string,
  pagination?: {
    total: number,
    pages: number
  }
  data?: null | Record<string, unknown>[] | Record<string, unknown>
};

export type EndpointHandler<T> = (payload: T) => Promise<EndpointResponse>;
