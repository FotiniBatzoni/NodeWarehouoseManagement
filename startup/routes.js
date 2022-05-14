const express = require("express");
const baseDirectory = require("path").resolve("./");
const fs = require("fs");
const categories = require("../routes/categories");
const signup = require("../routes/signup");
const login = require("../routes/login");
const changePassword = require("../routes/changePassword");
const forgotPassword = require("../routes/forgotPassword");
const roles =require("../routes/roles");
const users = require("../routes/users");
const suppliers = require("../routes/suppliers");
const stores = require("../routes/stores");
const products = require("../routes/products");
const batches = require("../routes/batches");

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
  app.use("/api/login",login);
  app.use("/api/change_password",changePassword);
  app.use("/api/forgot_password",forgotPassword);
  app.use("/api/roles",roles);
  app.use("/api/users",users);
  app.use("/api/suppliers",suppliers);
  app.use("/api/stores",stores);
  app.use("/api/products",products);
  app.use("/api/batches",batches);
};