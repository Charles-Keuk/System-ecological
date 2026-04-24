require("dotenv").config();
const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const cors       = require("cors");
const path       = require("path");
const fs         = require("fs");

const routes      = require("./routes");
const socketSetup = require("./socket");

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*", methods: ["GET","POST"] },
});

socketSetup(io);

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

app.use("/api", routes);
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use((_, res) => res.status(404).json({ message: "Route introuvable" }));
app.use((err, _, res, __) => res.status(500).json({ message: err.message }));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 EcoAlert API sur http://localhost:${PORT}`));
