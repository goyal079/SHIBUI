import express from "express";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  errorMiddleware,
  passwordUpdateRules,
  registrationRules,
  userLoginValidations,
} from "../../middlewares/validations/index.js";
import sendToken from "../../helpers/sendToken.js";
import passwordToken from "../../helpers/resetPasswordToken.js";
import sendMail from "../../helpers/sendMail.js";
import verifyToken from "../../middlewares/auth/index.js";
import isAdmin from "../../helpers/isAdmin.js";
import cloudinary from "cloudinary";
const router = express.Router();
/*
      API EndPoint : /api/user/register
      Method : POST
      Payload :  email,password,name 
      Access Type : Public
      Description :Register new user
*/
router.post(
  "/register",
  registrationRules(),
  errorMiddleware,
  async (req, res) => {
    try {
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
      const duplicate = await User.findOne({ email: req.body.email });
      if (duplicate) {
        return res.status(409).json({ errormsg: "User already exists" });
      }

      const newUser = new User({
        ...req.body,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(req.body.password, salt);
      await newUser.save();
      sendToken(newUser, 201, res);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

/*
      API EndPoint : /api/users/login
      Method : POST
      Payload : Request.Body - email,password
      Access Type : Public
      Validations : 
          a) Check Valid Email and verify if password is the same
      Description : User Login 
*/
router.post(
  "/login",
  userLoginValidations(),
  errorMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ errormsg: "Invalid login credentials" });
      }

      let correctPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!correctPassword) {
        return res.status(401).json({ errormsg: "Invalid login credentials" });
      }
      sendToken(user, 200, res);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

/*
      API EndPoint : /api/users/logout
      Method : POST
      Payload : none
      Access Type : Public
      Validations : 
      Description : User Logou 
*/
router.get("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({ successmsg: "Logged Out" });
  } catch (error) {
    res.status(500).json(error);
  }
});

/*
      API EndPoint : /api/users/forgot
      Method : POST
      Payload : email
      Access Type : Public
      Validations : user email
      Description : Forgot Password Email 
*/
router.post("/password/forgot", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      console.log(user);
      return res.status(401).json({ errormsg: "User Not Found" });
    }
    const resetToken = passwordToken(user);
    await user.save({ validateBeforeSave: false });
    const userPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
    const message = `Your password reset url is :- \n\n ${userPasswordUrl} \n\n If you have not requested this email then, please ignore it `;
    sendMail({ email: user.email, message, subject: "Reset Password Link" });
    res
      .status(200)
      .json({ successmsg: `Email sent to ${user.email} successfully` });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json(error);
  }
});

/*
      API EndPoint : /api/users/password/reset
      Method : PUT
      Payload : password,confirmpassword 
      Access Type : Public
      Validations : user email
      Description : Forgot Password Email 
*/
router.put("/password/reset/:token", async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return res
      .status(404)
      .json({ errormsg: "Reset password Token is invalid or expired" });
  }
  if (req.body.password !== req.body.confirmpassword) {
    return res.status(401).json({ errormsg: "Passwords do not Match" });
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

/*
      API EndPoint : /api/users/me 
      Method : GET
      Payload :  None 
      Access Type : Private
      Description :Get user details
*/
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id, "-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/users/password/update 
      Method : PUT
      Payload :  password,confirmpassword 
      Access Type : Private
      Description :change password
*/
router.put(
  "/password/update",
  passwordUpdateRules(),
  verifyToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      let correctPassword = await bcrypt.compare(
        req.body.oldpassword,
        user.password
      );
      if (!correctPassword) {
        return res
          .status(401)
          .json({ errormsg: "Your old password is incorrect" });
      }
      if (req.body.newpassword !== req.body.confirmpassword) {
        return res.status(400).json({ errormsg: "Passwords do not Match" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newpassword, salt);
      await user.save();
      sendToken(user, 200, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ errormsg: "Internal Server Error" });
    }
  }
);

/*
      API EndPoint : /api/users/profile/update 
      Method : PUT
      Payload :  userprofile data 
      Access Type : Private
      Description :update user profile
*/
router.put("/profile/update", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name ? req.body.name : user.name;
    user.email = req.body.email ? req.body.email : user.email;
    if (req.body.avatar !== "") {
      if (user.avatar.public_id != "") {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    await user.save();
    res.status(200).json({ successmsg: "User Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});
/*
      API EndPoint : /api/all/
      Method : GET
      Payload :  None 
      Access Type : Private/Admin
      Description :Get all users details
*/
router.get("/admin", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});
/*
      API EndPoint : /api/users/:id 
      Method : GET
      Payload :  None 
      Access Type : Private/Admin
      Description :Get specific users details
*/
router.get("/admin/:id", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    const user = await User.findById(req.params.id, "-password");
    if (!user) {
      return res.status(404).json({ errormsg: "User Not Found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/users/profile/adminaccess 
      Method : PUT
      Payload :  admin data 
      Access Type : Private/Admin
      Description :give admin access to user
*/
router.put("/admin/:id", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    const user = await User.findById(req.params.id);
    user.name = req.body.name ? req.body.name : user.name;
    user.email = req.body.email ? req.body.email : user.email;
    user.isAdmin =
      req.body.isAdmin != undefined ? req.body.isAdmin : user.isAdmin;
    await user.save();
    res.status(200).json({ successmsg: "User Updated Successfully" });
  } catch (error) {
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/users/delete/:id 
      Method : DELETE
      Payload : NONE
      Access Type : Private/Admin
      Description :Delete user
*/
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ errormsg: "User Not Found" });
    }
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    await user.remove();
    res.status(200).json({ successmsg: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

export default router;
