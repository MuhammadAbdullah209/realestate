const ErrorHandler = require("./error");
const jwt = require("jsonwebtoken");

const VerifyToken = (req, res, next) => {
  const token = req.cookies?.Access_Token; 

  if (!token) return next(ErrorHandler(401, 'UnAuthorized'));

  jwt.verify(token, process.env.JWT_SECRETE, (err, user) => {
    if (err) return next(ErrorHandler(403, 'Forbidden'));
    req.user = user;
    next();
  });
};

module.exports = { VerifyToken };
