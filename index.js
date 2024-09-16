const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");

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
app.use(cors());
app.use(morgan("common"));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
