const express = require("express");
const app = express();
const PORT = 5001;

app.use(express.static("public"));

app.use((req, res, next) => {
  console.log("Accessing page...");
  next();
});

const server = require("http").createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serving html files. Navigate to http://localhost:${PORT}`);
});
