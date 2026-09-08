import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const cached = globalThis as unknown as {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!cached.mongoose) {
  cached.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase() {
  if (cached.mongoose.conn) {
    return cached.mongoose.conn;
  }

  if (!cached.mongoose.promise) {
    console.log("Connecting to MongoDB...");

    cached.mongoose.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.mongoose.conn = await cached.mongoose.promise;

    console.log("MongoDB connected successfully");

    return cached.mongoose.conn;
  } catch (error) {
    cached.mongoose.promise = null;
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}