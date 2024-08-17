import express from "express";
import bodyParser from "body-parser";
import auth from "./routes/auth";
import admin from "./routes/admin";
import web from "./routes/web";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware for logging requests
// Create a write stream (in append mode) for logging to a file
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

// Setup morgan to log requests to the console and the file
app.use(morgan("combined", { stream: logStream }));
app.use(morgan("dev")); // Logs to the console in 'dev' format

// Middleware
app.use(bodyParser.json());

// authentication routes
app.use("/auth", auth);

// admin middleware routes
app.use("/admin", admin);

// default routes
app.use("/", web);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
