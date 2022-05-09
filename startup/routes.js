const express = require("express");
const baseDirectory = require("path").resolve("./");
const fs = require("fs");
const categories = require("../routes/categories");
const signup = require("../routes/signup");
const auth = require("../routes/auth");
const roles =require("../routes/roles")

//to handle res.header
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, x-auth-token"
      );
      next();
    });

      //When enabled, Express attempts to determine the IP address of the client connected
  //through the front-facing proxy, or series of proxies.
  app.enable("trust proxy");

  app.use(express.json({ limit: "20mb" }));

  app.use("/api/categories",categories);
  app.use("/api/signup",signup);
  app.use("/api/auth",auth);
  app.use("/api/roles",roles)

};