const express = require("express");
const app = express();
const fs = require("fs");
const basePath = require("path").resolve("./");

require("dotenv").config();
require("./startup/logging")();
require("./startup/db")();

require("./startup/routes")(app);

const port = process.env.PORT  || 3000;

app.listen(port,()=> console.log(`Listening on port ${port}...`))

