import express from "express";
const app = express();

import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log("__dirname", __dirname);

const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read();

const initalData = { users: [] };
db.data ||= initalData;

app.use(express.json());

app.get("/users", async (req, res) => {
  await db.read();
  const { users } = db.data || initalData;
  console.log("users");
  console.log("users", users);
  res.send(users);
});

app.post("/user", async (req, res) => {
  const user = req.body;
  const { users } = db.data;
  users.push(user);

  await db.write();
  res.send(true);
});

app.listen(7000, () => {
  console.log("Server is running");
});
