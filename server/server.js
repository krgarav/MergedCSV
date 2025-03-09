const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const fileUploadRoutes = require("./router/excell");
const builtPath = path.join(__dirname, "../../MergeData/client/dist");
app.use(express.static(builtPath));

app.use(cors());
app.use(express.json());
app.use("/upload", fileUploadRoutes);
app.get("*", (req, res) => {
  res.sendFile(path.join(builtPath, "index.html"));
});

app.listen(4000, () => {
  console.log("server is running on port 5000");
});
