import { MongoClient } from "./deps.ts";

const client = new MongoClient();
client.connectWithUri(Deno.env.get("MONGODB_URI")!);

interface UserSchema {
  _id: { $oid: string };
  name: string;
  email: string;
  password: string;
}

interface SurveySchema {
  _id: { $oid: string };
  name: string;
  description: string;
  userId: string;
}

const db = client.database("survey");

export const usersCollection = db.collection<UserSchema>("users");
export const surveyCollection = db.collection<SurveySchema>("surveys");
