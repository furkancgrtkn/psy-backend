const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/VerifyToken");

router.get("/", verifyToken, function (req, res) {
  let sql = `SELECT * FROM ((addresses INNER JOIN city ON addresses.city = city.city_id) INNER JOIN district ON addresses.district = district.district_id) WHERE user_id = ${req.decodedToken.id} `;
  db.query(sql, function (err, data, fields) {
    res.json({
      status: 200,
      data,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.get("/city", function (req, res) {
  let sql = `SELECT city_id AS value, city_name AS text FROM city`;
  db.query(sql, function (err, data, fields) {
    res.json({
      status: 200,
      data,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.get("/district/:id", function (req, res) {
  let sql = `SELECT district_id AS value, district_name AS text FROM district WHERE city_id = ${req.params.id}`;
  db.query(sql, function (err, data, fields) {
    res.json({
      status: 200,
      data,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.post("/create", verifyToken, (req, res) => {
  let sqlAdd = `INSERT INTO addresses(title, detail, city, district, phone_number, user_id) VALUES (?)`;
  let values = [
    req.body.title,
    req.body.detail,
    req.body.city,
    req.body.district,
    req.body.phone_number,
    req.decodedToken.id,
  ];
  db.query(sqlAdd, [values], function (err, data, fields) {
    if (
      !req.body.title &&
      !req.body.detail &&
      !req.body.city &&
      !req.body.district &&
      !req.body.phone_number
    ) {
      return res.status(400).json({
        status: "error",
        error: "Tüm Alanları Doğru Şekilde Doldurunuz.",
      });
    }
    if (err) {
      return res.status(400).json({ err });
    }
    res.json({
      status: 200,
      message: "Adres Eklendi.",
    });
  });
});

router.post("/delete", verifyToken, function (req, res) {
  let sql = `DELETE FROM addresses WHERE address_id = ${req.body.id} AND user_id = ${req.decodedToken.id}`;
  db.query(sql, function (err, data, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    if (!req.body.id) {
      return res.status(400).json({
        status: "error",
        error: "Hatalı İşlem.",
      });
    }
    res.json({
      status: 200,
      message: "Adres Başarıyla Silindi.",
    });
  });
});

module.exports = router;
