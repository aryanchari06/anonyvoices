import mongoose from "mongoose";

// specifies that the isConnected is a number
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};
// const objectName = {}          //js
// const objectName: Type = {}    //ts

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    if (db) console.log("DB connected successfully");
    // console.log(db)
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log("Database connection failed: ", error);
    process.exit(1);
  }
}

export default dbConnect;
