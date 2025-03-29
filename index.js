const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const reportRoutes = require("./routes/reportRoutes");
app.use("/report", reportRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const activityRoutes = require("./routes/activityRoutes");
app.use("/", activityRoutes);

