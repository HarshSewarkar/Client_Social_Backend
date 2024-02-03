const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");

dotenv.config();

try {
  mongoose.connect(
    process.env.MONGODB_URL,
    console.log("Mongodb is connected")
  );
} catch (error) {
  console.log(error);
}

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port 3000`);
});
