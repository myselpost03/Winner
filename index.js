import express from "express";
import compression from "compression";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./Routes/auth.js";
import userRoutes from "./Routes/users.js";
import selpostRoutes from "./Routes/selposts.js";
import commentRoutes from "./Routes/comments.js";
import fireRoutes from "./Routes/fires.js";
import relationshipRoutes from "./Routes/relationships.js";
import usernameRoutes from "./Routes/searches.js";
import userlistRoutes from "./Routes/userlists.js";
import chatRoutes from "./Routes/chats.js";
import notificationRoutes from "./Routes/notifications.js";
import feedbackRoutes from "./Routes/feedbacks.js";
import trendingRoutes from "./Routes/trendings.js";
import suggestionRoutes from "./Routes/suggestions.js";
import sodRoutes from "./Routes/sods.js";
import guessRoutes from "./Routes/guesses.js";
import collectionRoutes from "./Routes/collections.js";
import fireNotificationRoutes from "./Routes/fireNotifications.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://myselpost.com",
    credentials: true,
  })
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticFilesDirectory = path.join(__dirname, "public");
const staticFilesCacheControl = "public, max-age=31536000";
app.use(
  express.static(staticFilesDirectory, {
    maxAge: "1y",
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === ".html") {
        res.setHeader("Cache-Control", "no-store");
      } else {
        res.setHeader("Cache-Control", staticFilesCacheControl);
      }
    },
  })
);
app.use(
  "/static",
  express.static("path/to/static/assets", {
    maxAge: "1y",
  })
);
app.use(cookieParser());
app.use(compression());
app.get("/", (req, res) => {
  res.send("Everything is working fine!");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/userlist", userlistRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/usernames", usernameRoutes);
app.use("/api/selposts", selpostRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/fires", fireRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/trendings", trendingRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/sod", sodRoutes);
app.use("/api/guesses", guessRoutes);
app.use("/api/fireNotifications", fireNotificationRoutes);
app.use("/api/collections", collectionRoutes);

app.options("*", cors());

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
