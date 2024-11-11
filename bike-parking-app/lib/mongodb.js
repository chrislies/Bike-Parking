import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      // Connection is not established
      await mongoose.connect(process.env.MONGODB_URI);
      // console.log("Database connected");
    }
  } catch (error) {
    // console.log(error);
  }
};

export default connectDB;
