const express = require("express");
const cors = require("cors");
const { port } = require("./config/config");

const app = express();
app.use(cors());

app.listen(port, () => {
  console.log(`server run on ${port} `);
});
