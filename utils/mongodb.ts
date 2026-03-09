import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

export const mongoClient = new MongoClient(uri);

export const getPaycrestOrdersCollection = () => {
  return mongoClient.db("Offrail").collection("paycrest_orders");
};
