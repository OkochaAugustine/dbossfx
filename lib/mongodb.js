import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) throw new Error("MONGO_URI missing");

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function connectToMongo() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false, // remove dbName if it's in the URI
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export const connectDB = connectToMongo;