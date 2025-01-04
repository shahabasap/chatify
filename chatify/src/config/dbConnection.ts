import mongoose from "mongoose";

const connectToDatabase = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGO_URI as string;
    if (!MONGO_URI) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process with failure code
  }
};

export default connectToDatabase;
