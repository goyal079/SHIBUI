import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, maxlength: 30, minlength: 2 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

const userModel = new mongoose.model("User", userSchema, "users");
export default userModel;
