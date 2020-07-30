import { usersCollection } from "../mongo.ts";
import Base from "./Base.ts";

export default class Users extends Base {
  public id: string;
  public name: string;
  public email: string;
  public password: string;

  constructor({ id = "", name = "", email = "", password = "" }) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async findOne(params: object) {
    const user = await usersCollection.findOne(params);
    if (!user) {
      return null;
    }
    return Users.prepare(user);
  }

  async createUser() {
    delete this.id;
    const { $oid } = await usersCollection.insertOne(this);
    this.id = $oid;
    return this;
  }

  protected static prepare(data: any): Users {
    data = Base.prepare(data);
    const user = new Users(data);
    return user;
  }
}
