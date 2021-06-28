const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/VerifyAdmin");

router.get("/sliders", function (req, res) {
  let sql = `SELECT * FROM sliders`;
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

router.get("/banners", function (req, res) {
  let sql = `SELECT * FROM banners`;
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

router.post("/create_slider", verifyAdmin, (req, res) => {
  let sqlAdd = `INSERT INTO sliders(title, description, image) VALUES (?)`;
  let values = [req.body.title, req.body.description, req.body.image];
  db.query(sqlAdd, [values], function (err, data, fields) {
    if (!req.body.title && !req.body.description && !req.body.image) {
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
      message: "Slider Eklendi.",
    });
  });
});

router.post("/create_banner", verifyAdmin, (req, res) => {
  let sqlAdd = `INSERT INTO banners(title, pathname, image) VALUES (?)`;
  let values = [req.body.title, req.body.pathname, req.body.image];
  db.query(sqlAdd, [values], function (err, data, fields) {
    if (!req.body.title && !req.body.pathname && !req.body.image) {
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
      message: "Banner Eklendi.",
    });
  });
});

router.delete("/delete_slider", verifyAdmin, function (req, res) {
  let sql = `DELETE FROM sliders WHERE slider_id = ${req.body.id}`;
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
      message: "Slider Başarıyla Silindi.",
    });
  });
});

router.delete("/delete_banner", verifyAdmin, function (req, res) {
  let sql = `DELETE FROM banners WHERE banner_id = ${req.body.id}`;
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
      message: "Banner Başarıyla Silindi.",
    });
  });
});

module.exports = router;
