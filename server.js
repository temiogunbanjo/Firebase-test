const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.static("public"))

const server = require('http').createServer(app);
server.listen(PORT, () => {
    console.log(`Serving html files. Navigate to http://localhost:${PORT}`)
});