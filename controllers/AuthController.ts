import {
  RouterContext,
  hashSync,
  compareSync,
  Payload,
  setExpiration,
  Jose,
  makeJwt,
} from "../deps.ts";
import Users from "../models/Users.ts";

const key = Deno.env.get("JWT_SECRET_KEY")!;

const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

class AuthController {
  async login(ctx: RouterContext) {
    const { email, password } = await ctx.request.body().value;

    let user = await Users.findOne({ email: email });
    if (!user) {
      ctx.response.status = 400;
      ctx.response.body = { message: "User does not exist with this email." };
      return;
    }
    if (!compareSync(password, user.password)) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Password is incorrect." };
      return;
    }

    const payload: Payload = {
      iss: user.email,
      exp: setExpiration(new Date().getTime() + 60 * 60 * 1000),
    };

    const jwt = await makeJwt({ key, header, payload });
    console.log(jwt);

    ctx.response.body = {
      id: user.id,
      name: user.name,
      email: user.email,
      jwt: jwt,
    };
  }

  async register(ctx: RouterContext) {
    const { name, email, password } = await ctx.request.body().value;

    const user = await Users.findOne({ email: email });
    if (user) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Email already is use." };
      return;
    }

    const hashedPassword = hashSync(password);
    let newUser = new Users({ name, email, password: hashedPassword });
    const createdUser = await newUser.createUser();
    console.log(createdUser);
    ctx.response.status = 201;
    ctx.response.body = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  }
}

const authController = new AuthController();

export default authController;
