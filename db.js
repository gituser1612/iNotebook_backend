import mongoose from 'mongoose';

const mongoURI = "mongodb+srv://amitpandey02871_db_user:vQRy91N8jdlqZS1x@cluster0.pjuqu7v.mongodb.net/inotebook"; 

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log(" Connected to MongoDB successfully");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectToMongo;
