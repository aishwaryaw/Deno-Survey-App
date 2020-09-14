import {MongoClient} from './depts.ts';


const client = new MongoClient();

client.connectWithUri(Deno.env.get("MONGODB_URI") || "");

const db = client.database(Deno.env.get("DB_NAME") || "");
// console.log(db);
export default db;
export const userCollection = db.collection("users");
export const surveyCollection = db.collection("surveys");
export const questionCollection = db.collection("questions");
export const answersCollection = db.collection("answers");