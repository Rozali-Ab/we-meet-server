import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import http from "http";
import { fileURLToPath } from "url";

import { initWebSocket } from "./web-socket/index.js";

const app = express();
const port = process.env.SERVER_PORT || "3000";
const server = http.createServer(app);
initWebSocket(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
