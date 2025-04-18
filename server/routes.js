import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, "..", "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "src", "home.html"));
});
