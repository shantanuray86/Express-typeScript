import mongoose from  "mongoose";

// Document interface
interface User {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
}
const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    }

  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);;
