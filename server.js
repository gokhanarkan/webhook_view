import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";

import { createId, getRequests, saveRequest } from "./events.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(xss());
app.use(hpp());
app.use(cors());

app.use(express.static(path.join(path.resolve(), "app", "out")));

// Routes
app.get("/", (_, res) => {
  res.sendFile(path.join(path.resolve(), "app", "out", "index.html"));
});
app.get("/:id/:connectionKey", (_, res) => {
  res.sendFile(path.join(path.resolve(), "app", "out", "index.html"));
});
app.get("/create", createId);
app.get("/events/:id/:connectionKey", getRequests);
app
  .get("/:id", saveRequest)
  .post("/:id", saveRequest)
  .put("/:id", saveRequest)
  .delete("/:id", saveRequest);

const PORT = process.env.PORT || 1111;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
