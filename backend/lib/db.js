import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { MONGO_URL } = process.env ;
    if(!MONGO_URL) throw new Error("MONGO_URL is not set")
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MONGODB CONNECTED");
  } catch (error) {
    console.log("Mongodb connection error", error);
    process.exit(1); //1 means fail, 0 means success
  }
};
