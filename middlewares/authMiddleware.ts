import { RouterContext, validateJwt } from "../deps.ts";
import Users from "../models/Users.ts";
export const authMiddleware = async (ctx: RouterContext, next: Function) => {
  const headers = ctx.request.headers;

  const authHeader = headers.get("Authorization");
  if (!authHeader) {
    ctx.response.status = 401;
    return;
  }

  const jwt = authHeader.split(" ")[1];
  if (!jwt) {
    ctx.response.status = 401;
    return;
  }
  const key = Deno.env.get("JWT_SECRET_KEY")!;
  const data = await validateJwt({ jwt, key, algorithm: "HS256" });

  if (data.isValid) {
    const user = await Users.findOne({ email: data.payload?.iss });
    ctx.state.user = user;
    await next();
  } else {
    ctx.response.status = 401;
  }
};
