import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../constants";

const connectDB = async ():Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log(
      `Mongodb connected !! DB Host ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Mongodb Connection Errro` + error);
    process.exit(1);
  }
};

export default connectDB;