import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import entryRoutes from "./routes/entries.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/entry", entryRoutes);
app.get("/", (req, res) => {
  res.send("Sleep tracking hello");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))
  )
  .catch((error) => {
    error.message;
  });

mongoose.set("useFindAndModify", false);
