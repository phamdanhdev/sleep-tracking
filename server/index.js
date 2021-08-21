import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/users.js";
import entryRoutes from "./routes/entries.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/entry", entryRoutes);

const CONNECTION_URL =
  "mongodb+srv://phamdanhdev:phamdanhdev123@cluster0.pqhg4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, {
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
