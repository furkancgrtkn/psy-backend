const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const AuthController = require("./src/auth/AuthController");
const productsRouter = require("./src/router/productsRouter");
const basketRouter = require("./src/router/basketRouter");
const shippingRouter = require("./src/router/shippingRouter");
const addressRouter = require("./src/router/addressRouter");
const bannerAndSliderRouter = require("./src/router/bannerAndSliderRouter");
const app = express();

db = mysql.createConnection({
  host: "",
  port: 3306,
  user: "root",
  password: "",
  database: "",
});

app.use(cors());
app.use(bodyParser.json());
let port = process.env.PORT || 5000;

app.use("/api/auth", AuthController);

app.use("/api/products", productsRouter);

app.use("/api/basket", basketRouter);

app.use("/api/shipping", shippingRouter);

app.use("/api/address", addressRouter);

app.use("/api/home", bannerAndSliderRouter);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
