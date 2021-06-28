const jwt = require("jsonwebtoken");
const config = require("../config");

function verifyAdmin(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(403).send({ message: "Lütfen Giriş Yapınız" });
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  const decodedToken = jwt.verify(
    bearerToken,
    config.secret,
    function (err, decoded) {
      if (err) {
        res.status(500).send({ message: "Token Geçersiz." });
        return;
      }
      return decoded;
    }
  );
  if (decodedToken) {
    let sqlEmail = `SELECT * from users WHERE user_id = "${decodedToken.id}"`;
    db.query(sqlEmail, function (err, result, fields) {
      if (result.length > 0 ? result[0].type === 1 : null) {
        next();
      } else {
        res.status(403).send({ message: "Admin." });
      }
    });
  }
}

module.exports = verifyAdmin;
