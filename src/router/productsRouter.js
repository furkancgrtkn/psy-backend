const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/VerifyAdmin");

// get all portfolio items
router.get("/filter/:page/:fit/:sleeve/:color/:dess", function (req, res) {
  const limit = 12;
  // page number
  const page = req.params.page;
  // calculate offset
  const offset = (page - 1) * limit;
  let sql =
    `select * from products ${
      req.params.fit === "klasik"
        ? "WHERE fit = 0 AND"
        : req.params.fit === "slim-fit"
        ? "WHERE fit = 1 AND"
        : "WHERE fit IN (0, 1) AND"
    } ${
      req.params.sleeve === "kisa-kollu"
        ? "sleeve = 0"
        : req.params.sleeve === "uzun-kollu"
        ? "sleeve = 1"
        : "sleeve IN (0, 1)"
    } ${
      req.params.color === "renkler" ? "" : `AND color = ${req.params.color}`
    } ${
      req.params.dess === "artan"
        ? "ORDER BY discounted_price"
        : req.params.dess === "azalan"
        ? "ORDER BY discounted_price DESC"
        : ""
    } limit ` +
    limit +
    " OFFSET " +
    offset;
  db.query(sql, function (err, data, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    let sql2 = `select count(*) as pages from products  ${
      req.params.fit === "klasik"
        ? "WHERE fit = 0 AND"
        : req.params.fit === "slim-fit"
        ? "WHERE fit = 1 AND"
        : "WHERE fit IN (0, 1) AND"
    } ${
      req.params.sleeve === "kisa-kollu"
        ? "sleeve = 0"
        : req.params.sleeve === "uzun-kollu"
        ? "sleeve = 1"
        : "sleeve IN (0, 1)"
    } ${
      req.params.color === "renkler" ? "" : `AND color = ${req.params.color}`
    } ${
      req.params.dess === "artan"
        ? "ORDER BY discounted_price"
        : req.params.dess === "azalan"
        ? "ORDER BY discounted_price DESC"
        : ""
    }`;
    db.query(sql2, function (err, dataCount, fields) {
      if (err) {
        return res.status(400).json({ err });
      }
      res.json({
        status: 200,
        products_page_count: data.length,
        page_number: page,
        data,
        max_page: Math.ceil(dataCount[0].pages / 12),
      });
    });
  });
});

router.get("/productwithpage/:page", function (req, res) {
  // SELECT * FROM products inner join categories on categories.category_name = 'Telefon' and categories.id = products.categoryid
  // inner join categories on categories.id = products.categoryid
  // SELECT * FROM products inner join categories on categories.id = products.categoryid ORDER BY products.categoryid ASC
  const limit = 6;
  // page number
  const page = req.params.page;
  // calculate offset
  const offset = (page - 1) * limit;
  let sql =
    "select * from products ORDER BY discounted_price ASC limit " +
    limit +
    " OFFSET " +
    offset;
  db.query(sql, function (err, data, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    let sql2 = "select count(*) as pages from products";
    db.query(sql2, function (err, dataCount, fields) {
      if (err) {
        return res.status(400).json({ err });
      }
      res.json({
        status: 200,
        products_page_count: data.length,
        page_number: page,
        data,
        max_page: Math.ceil(dataCount[0].pages / 12),
      });
    });
  });
});

router.get("/all/products/get", function (req, res) {
  let sql =
    "select * from products INNER JOIN colors on colors.color_id = products.color";
  db.query(sql, function (err, data, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    res.json({
      status: 200,
      product: data,
    });
  });
});

router.get("/detail/:id", function (req, res) {
  let sql = `SELECT * FROM products INNER JOIN colors on colors.color_id = products.color WHERE product_id = ${req.params.id} `;
  db.query(sql, function (err, data, fields) {
    let sql = `SELECT * FROM products INNER JOIN colors on colors.color_id = products.color WHERE code = ${data[0].code} AND product_id != ${req.params.id} `;
    db.query(sql, function (err, dataAdd, fields) {
      res.json({
        status: 200,
        product: data,
        colors: dataAdd,
      });
    });
    if (err) {
      return res.status(400).json({ err });
    }
  });
});

router.post("/create", verifyAdmin, (req, res) => {
  let sql = `INSERT INTO products(name, size, fit, detail, images, sleeve, price, discounted_price, color, code) VALUES (?)`;
  let values = [
    req.body.name,
    req.body.size,
    req.body.fit,
    req.body.detail,
    req.body.images,
    req.body.sleeve,
    req.body.price,
    req.body.discounted_price,
    req.body.color,
    req.body.code,
  ];
  db.query(sql, [values], function (err, data, fields) {
    if (err) {
      return res
        .status(400)
        .json({ error: "Tüm Alanları Doğru Şekilde Doldurunuz." });
    }
    res.json({
      status: 200,
      message: "Ürün Başarıyla Eklendi.",
    });
  });
});

router.post("/create_color", verifyAdmin, (req, res) => {
  let sql = `INSERT INTO colors(color_name) VALUES (?)`;
  let values = [req.body.color];
  db.query(sql, [values], function (err, data, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    if (!req.body.color) {
      return res.status(400).json({
        status: "error",
        error: "Tüm Alanları Doğru Şekilde Doldurunuz.",
      });
    }
    res.json({
      status: 200,
      message: "Renk Başarıyla Eklendi.",
    });
  });
});

router.get("/get_colors", (req, res) => {
  let sql = `SELECT color_id AS value, color_name AS text from colors`;
  db.query(sql, function (err, data, fields) {
    if (err) {
      return res.status(400).json({ err });
    }
    res.json({
      status: 200,
      data,
    });
  });
});

router.post("/delete", verifyAdmin, function (req, res) {
  let sql = `DELETE FROM products WHERE product_id = ${req.body.id}`;
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

router.put("/update", verifyAdmin, function (req, res) {
  let sql = `UPDATE products SET name="${req.body.name}", size="${req.body.size}", fit=${req.body.fit}, detail="${req.body.detail}", images="${req.body.images}", sleeve=${req.body.sleeve}, price=${req.body.price}, color=${req.body.color}, discounted_price=${req.body.discounted_price} WHERE product_id = ${req.body.id}`;
  db.query(sql, function (err, data, fields) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      status: 200,
      message: "Ürün Başarıyla Güncellendi.",
    });
  });
});

module.exports = router;
