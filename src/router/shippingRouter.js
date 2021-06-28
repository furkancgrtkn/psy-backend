const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/VerifyToken");
const verifyAdmin = require("../middleware/VerifyAdmin");

router.get("/waiting", verifyToken, function (req, res) {
  let sql = `SELECT * FROM shipping WHERE status = 0 AND user_id = ${req.decodedToken.id}`;
  db.query(sql, function (err, data, fields) {
    let sendForObject = [];
    data.map((e) =>
      sendForObject.push({
        ship_id: e.ship_id,
        basket: JSON.parse(e.basket),
        user_id: e.user_id,
        status: e.status,
        status_detail: e.status_detail,
        address_info: JSON.parse(e.address_info),
        total_price: e.total_price,
        created_at: e.created_at,
        updated_at: e.updated_at,
      })
    );
    res.json({
      status: 200,
      data: sendForObject,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.get("/all_waiting", verifyAdmin, function (req, res) {
  let sql = `SELECT * FROM shipping INNER JOIN users ON shipping.user_id = users.user_id WHERE status = 0`;
  db.query(sql, function (err, data, fields) {
    let sendForObject = [];
    data.map((e) =>
      sendForObject.push({
        ship_id: e.ship_id,
        basket: JSON.parse(e.basket),
        user_id: e.user_id,
        status: e.status,
        status_detail: e.status_detail,
        address_info: JSON.parse(e.address_info),
        total_price: e.total_price,
        created_at: e.created_at,
        updated_at: e.updated_at,
        name: e.name,
        surname: e.surname,
        email: e.email,
        phone_number: e.phone_number,
      })
    );
    res.json({
      status: 200,
      data: sendForObject,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.get("/all_verified", verifyAdmin, function (req, res) {
  let sql = `SELECT * FROM shipping INNER JOIN users ON shipping.user_id = users.user_id WHERE status = 1`;
  db.query(sql, function (err, data, fields) {
    let sendForObject = [];
    data.map((e) =>
      sendForObject.push({
        ship_id: e.ship_id,
        basket: JSON.parse(e.basket),
        user_id: e.user_id,
        status: e.status,
        status_detail: e.status_detail,
        address_info: JSON.parse(e.address_info),
        total_price: e.total_price,
        created_at: e.created_at,
        updated_at: e.updated_at,
        name: e.name,
        surname: e.surname,
        email: e.email,
        phone_number: e.phone_number,
      })
    );
    res.json({
      status: 200,
      data: sendForObject,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.get("/all_past", verifyAdmin, function (req, res) {
  let sql = `SELECT * FROM shipping INNER JOIN users ON shipping.user_id = users.user_id WHERE status = 2`;
  db.query(sql, function (err, data, fields) {
    let sendForObject = [];
    data.map((e) =>
      sendForObject.push({
        ship_id: e.ship_id,
        basket: JSON.parse(e.basket),
        user_id: e.user_id,
        status: e.status,
        status_detail: e.status_detail,
        address_info: JSON.parse(e.address_info),
        total_price: e.total_price,
        created_at: e.created_at,
        updated_at: e.updated_at,
        name: e.name,
        surname: e.surname,
        email: e.email,
        phone_number: e.phone_number,
      })
    );
    res.json({
      status: 200,
      data: sendForObject,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.get("/all_denied", verifyAdmin, function (req, res) {
  let sql = `SELECT * FROM shipping INNER JOIN users ON shipping.user_id = users.user_id WHERE status = 3`;
  db.query(sql, function (err, data, fields) {
    let sendForObject = [];
    data.map((e) =>
      sendForObject.push({
        ship_id: e.ship_id,
        basket: JSON.parse(e.basket),
        user_id: e.user_id,
        status: e.status,
        status_detail: e.status_detail,
        address_info: JSON.parse(e.address_info),
        total_price: e.total_price,
        created_at: e.created_at,
        updated_at: e.updated_at,
        name: e.name,
        surname: e.surname,
        email: e.email,
        phone_number: e.phone_number,
      })
    );
    res.json({
      status: 200,
      data: sendForObject,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.get("/verified", verifyToken, function (req, res) {
  let sql = `SELECT * FROM shipping WHERE status = 1 AND user_id = ${req.decodedToken.id}`;
  db.query(sql, function (err, data, fields) {
    let sendForObject = [];
    data.map((e) =>
      sendForObject.push({
        ship_id: e.ship_id,
        basket: JSON.parse(e.basket),
        user_id: e.user_id,
        status: e.status,
        status_detail: e.status_detail,
        address_info: JSON.parse(e.address_info),
        total_price: e.total_price,
        created_at: e.created_at,
        updated_at: e.updated_at,
      })
    );
    res.json({
      status: 200,
      data: sendForObject,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.get("/past", verifyToken, function (req, res) {
  let sql = `SELECT * FROM shipping WHERE status = 2 AND user_id = ${req.decodedToken.id}`;
  db.query(sql, function (err, data, fields) {
    let sendForObject = [];
    data.map((e) =>
      sendForObject.push({
        ship_id: e.ship_id,
        basket: JSON.parse(e.basket),
        user_id: e.user_id,
        status: e.status,
        status_detail: e.status_detail,
        address_info: JSON.parse(e.address_info),
        total_price: e.total_price,
        created_at: e.created_at,
        updated_at: e.updated_at,
      })
    );
    res.json({
      status: 200,
      data: sendForObject,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.get("/denied", verifyToken, function (req, res) {
  let sql = `SELECT * FROM shipping WHERE status = 3 AND user_id = ${req.decodedToken.id}`;
  db.query(sql, function (err, data, fields) {
    let sendForObject = [];
    data.map((e) =>
      sendForObject.push({
        ship_id: e.ship_id,
        basket: JSON.parse(e.basket),
        user_id: e.user_id,
        status: e.status,
        status_detail: e.status_detail,
        address_info: JSON.parse(e.address_info),
        total_price: e.total_price,
        created_at: e.created_at,
        updated_at: e.updated_at,
      })
    );
    res.json({
      status: 200,
      data: sendForObject,
    });
    if (err) {
      return res.status(400);
    }
  });
});

router.post("/start", verifyToken, (req, res) => {
  const basket = JSON.stringify(req.body.basket);
  const address = JSON.stringify(req.body.address_info);
  let sqlAdd = `INSERT INTO shipping(basket, user_id, address_info, total_price) VALUES (?)`;
  let values = [basket, req.decodedToken.id, address, req.body.total_price];
  db.query(sqlAdd, [values], function (err, data, fields) {
    if (!req.body.basket) {
      return res.status(400).json({
        status: "error",
        error: "Tüm Alanları Doğru Şekilde Doldurunuz.",
      });
    }
    if (err) {
      return res.json({ err });
    }
    let sql = `SELECT * FROM basket WHERE user_id = ${req.decodedToken.id}`;
    db.query(sql, function (err, data, fields) {
      let sql = `DELETE FROM basket_items WHERE basket_id = ${data[0].basket_id}`;
      db.query(sql, function (err, data, fields) {});
    });
    res.json({
      status: 200,
      message: "Sipariş Başladı.",
    });
  });
});

router.post("/status_code", verifyAdmin, function (req, res) {
  let sql = `UPDATE shipping SET status="${req.body.status}", status_detail="${req.body.status_detail}" WHERE ship_id = ${req.body.id}`;
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
      message: "Sipariş Başarıyla Güncellendi.",
    });
  });
});

module.exports = router;
