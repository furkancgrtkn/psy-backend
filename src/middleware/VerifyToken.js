const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const config = require("../config"); // get our config file

function verifyToken(req, res, next) {
  //  check header or url parameters or post parameters for token
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(403).send({ message: "Lütfen Giriş Yapınız" });
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  // verifies secret and checks exp
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

  req.decodedToken = decodedToken;
  next();
}

module.exports = verifyToken;
