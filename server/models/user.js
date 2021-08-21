import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: { type: String },
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
});

export default mongoose.model("User", userSchema);
