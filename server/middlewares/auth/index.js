import AES from "crypto-js/aes.js";
import jwt, { decode } from "jsonwebtoken";
import enc from "crypto-js/enc-utf8.js";
import "dotenv/config";

function verifyToken(req, res, next) {
  try {
    let { token } = req.cookies;
    // decryptt
    if (!token) {
      return res
        .status(401)
        .json({ errormsg: "Session Expired. Login to get access" });
    }
    let bufferToken = AES.decrypt(token, process.env.AESKEY);
    let decryptedToken = enc.stringify(bufferToken);
    let decoded = jwt.verify(decryptedToken, process.env.JWTKEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ errormsg: "Internal Server Error" });
  }
}

export default verifyToken;
