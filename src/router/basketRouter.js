const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/VerifyToken");

router.get("/", verifyToken, function (req, res) {
  let sql = `SELECT * FROM basket WHERE user_id = ${req.decodedToken.id}`;
  db.query(sql, function (err, data, fields) {
    let sqlLast = `SELECT * FROM ((basket_items INNER JOIN products ON basket_items.product_id = products.product_id) INNER JOIN colors on colors.color_id = products.color) WHERE basket_id = ${data[0].basket_id}`;
    db.query(sqlLast, function (err, dataLast, fields) {
      if (err) {
        return res.status(400).json({ err });
      }
      let totalPrice = 0;
      for (let i = 0; i < dataLast.length; i++) {
        if (isNaN(dataLast[i].discounted_price)) {
          continue;
        }
        totalPrice += dataLast[i].discounted_price * dataLast[i].count;
      }

      let totalPriceNoDisc = 0;
      for (let i = 0; i < dataLast.length; i++) {
        if (isNaN(dataLast[i].discounted_price)) {
          continue;
        }
        totalPriceNoDisc += dataLast[i].price * dataLast[i].count;
      }

      res.json({
        status: 200,
        data: dataLast,
        totalPrice: totalPrice,
        totalPriceNoDisc: totalPriceNoDisc,
      });
    });
    if (err) {
      return res.status(400).json({ err });
    }
  });
});

router.post("/add_item", verifyToken, (req, res) => {
  if (!req.body.size) {
    return res.status(400).json({ message: "Lütfen Beden Seçiniz." });
  }
  let sql = `SELECT * FROM basket WHERE user_id = ${req.decodedToken.id}`;
  db.query(sql, function (err, data, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    let sql = `SELECT * FROM basket_items WHERE basket_id = ${data[0].basket_id} AND product_id = ${req.body.product_id} AND size_product = "${req.body.size}"`;
    db.query(sql, function (err, dataCheck, fields) {
      if (err) {
        return res.status(400).json({ err });
      }
      if (dataCheck[0] === undefined) {
        let sqlAdd = `INSERT INTO basket_items(basket_id, product_id, count, size_product) VALUES (?)`;
        let values = [
          data[0].basket_id,
          req.body.product_id,
          req.body.count,
          req.body.size,
        ];
        db.query(sqlAdd, [values], function (err, data, fields) {
          if (err) {
            return res.status(400).json({ err });
          }
          if (!req.body.product_id && !req.body.count && !req.body.size) {
            return res.status(400).json({
              status: "error",
              error: "Tüm Alanları Doğru Şekilde Doldurunuz.",
            });
          }
          res.json({
            status: 200,
            message: "Ürün Sepete Eklendi.",
          });
        });
      } else {
        let sql = `SELECT * FROM basket WHERE user_id = ${req.decodedToken.id}`;
        db.query(sql, function (err, data, fields) {
          if (err) {
            return res.status(400).json({ err });
          }
          let sql = `UPDATE basket_items SET count= count + 1 WHERE product_id = ${req.body.product_id} AND basket_id = ${data[0].basket_id} AND size_product = "${req.body.size}"`;
          db.query(sql, function (err, data, fields) {
            if (err) {
              return res.status(400).json({
                status: 400,
                error: "Yanlış Sepet.",
              });
            }
            res.json({
              status: 200,
              message: "Ürün Başarıyla Güncellendi.",
            });
          });
        });
      }
    });
  });
});

router.post("/delete_item", verifyToken, function (req, res) {
  let sql = `SELECT * FROM basket WHERE user_id = ${req.decodedToken.id}`;
  db.query(sql, function (err, data, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    let sql = `DELETE FROM basket_items WHERE basket_items_id = ${req.body.id} AND basket_id = ${data[0].basket_id}`;
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
        message: "Ürün Başarıyla Silindi.",
      });
    });
  });
});

router.put("/inc_count", verifyToken, function (req, res) {
  let sql = `SELECT * FROM basket WHERE user_id = ${req.decodedToken.id}`;
  db.query(sql, function (err, data, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    let sql = `UPDATE basket_items SET count= count + 1 WHERE basket_items_id = ${req.body.id} AND basket_id = ${data[0].basket_id}`;
    db.query(sql, function (err, data, fields) {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: "Yanlış Sepet.",
        });
      }
      res.json({
        status: 200,
        message: "Ürün Başarıyla Güncellendi.",
      });
    });
  });
});

router.put("/dec_count", verifyToken, function (req, res) {
  let sql = `SELECT * FROM basket WHERE user_id = ${req.decodedToken.id}`;
  db.query(sql, function (err, data, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    let sql = `UPDATE basket_items SET count= count - 1 WHERE basket_items_id = ${req.body.id} AND basket_id = ${data[0].basket_id} AND count > 1`;
    db.query(sql, function (err, data, fields) {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: "Yanlış Sepet.",
        });
      }
      if (data.changedRows === 0) {
        return res.status(400).json({
          status: 400,
          error: "Ürün Adeti -1 Olamaz.",
        });
      }
      res.json({
        data,
        status: 200,
        message: "Ürün Başarıyla Güncellendi.",
      });
    });
  });
});

module.exports = router;
