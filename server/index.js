const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const taskRoutes = require("./src/routes/task.routes");
app.use("/api/v1/tasks", taskRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});