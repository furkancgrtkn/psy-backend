const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const verifyToken = require("../middleware/VerifyToken");
const verifyAdmin = require("../middleware/VerifyAdmin");

router.post("/register", function (req, res) {
  let sqlEmail = `SELECT * from users WHERE email = "${req.body.email}"`;
  db.query(sqlEmail, function (err, result, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    if (result.length > 0)
      return res.status(400).send({
        auth: false,
        token: null,
        message: "Lütfen Kayıtlı Olmayan Bir Email Giriniz.",
      });
    if (!req.body.password)
      return res.status(400).send({
        auth: false,
        token: null,
        message: "Lütfen Şifre Giriniz.",
      });
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    let sql = `INSERT INTO users(name, surname, email, password, phone_number) VALUES (?)`;
    let values = [
      req.body.name,
      req.body.surname,
      req.body.email,
      hashedPassword,
      req.body.phone_number,
    ];
    db.query(sql, [values], function (err, result, fields) {
      if (err)
        return res.status(500).send("Tüm Alanları Doldurduğuna Emin misin ?");

      let sqlUser = `SELECT * from users WHERE email = "${values[2]}"`;
      db.query(sqlUser, function (err, result, fields) {
        if (err) {
          return res.status(400).json({ err });
        }
        let sqlUserBasket = `INSERT INTO basket(user_id) VALUES (${result[0].user_id})`;
        db.query(sqlUserBasket, function (err, result, fields) {
          if (err) {
            return res.status(400).json({ err });
          }
          res.status(200).send({ auth: true });
        });
      });
    });
  });
});

router.post("/login", function (req, res) {
  if (!req.body.password)
    return res.status(400).send({
      message: "Lütfen Şifre Giriniz.",
    });
  if (!req.body.email)
    return res.status(400).send({
      message: "Lütfen Email Giriniz.",
    });
  let sql = `SELECT * from users WHERE email = "${req.body.email}"`;
  db.query(sql, function (err, result, fields) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (result.length === 0) {
        res.status(401).send({
          auth: false,
          token: null,
          message: "Hatalı Email Adresi Girdiniz",
        });
      } else {
        // create a token
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          result[0].password
        );
        if (!passwordIsValid)
          return res.status(401).send({
            auth: false,
            token: null,
            message: "Hatalı Şifre Girdiniz",
          });

        var token = jwt.sign({ id: result[0].user_id }, config.secret, {
          noTimestamp: true,
          expiresIn: 86400, // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, user: result });
      }
    }
  });
});

router.get("/users", verifyAdmin, function (req, res) {
  let sql = `SELECT * from users WHERE type = 0`;
  db.query(sql, function (err, result, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    res.status(200).send({
      result,
    });
  });
});

module.exports = router;
