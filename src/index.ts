import express from "express";
import bodyParser from "body-parser";
import auth from "./routes/auth";
import admin from "./routes/admin";
import web from "./routes/web";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors"; // Import CORS

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;

// Implemented Security Policy
app.use(helmet());
app.use(cors());

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

// default routes
app.use("/", web);

// authentication routes
app.use("/auth", auth);

// admin middleware routes
app.use("/admin", admin);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
