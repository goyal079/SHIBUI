import jwt from "jsonwebtoken";
import "dotenv/config";
import AES from "crypto-js/aes.js";
function generateToken(user) {
  let token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWTKEY,
    { expiresIn: "3d" }
  );
  return AES.encrypt(token, process.env.AESKEY).toString();
}
export default generateToken;
