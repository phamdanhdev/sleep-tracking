import mongoose from "mongoose";

const entrySchema = mongoose.Schema({
  date: { type: String, require: true },
  sleepTime: { type: String, require: true },
  wakeUpTime: { type: String, require: true },
  sleepDuration: { type: String, require: true },
  creator: { type: String, require: true },
  createdAt: { type: Date, default: new Date() },
});

export default mongoose.model("Entry", entrySchema);
