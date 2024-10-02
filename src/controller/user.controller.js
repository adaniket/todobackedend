import User from "../model/user.model.js";
import { statusCodes } from "../utils/constant.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
class userController {
  // ============ methods =============

  static createUser = async (req, res) => {
    try {
      const { firstName, lastName, email, password, confirmPassword } =
        req.body;
      const allValues = firstName && lastName && email && password;
      if (!allValues) {
        return res
          .status(statusCodes.error)
          .json({ status: "error", message: "Every fields required!" });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(statusCodes.error)
          .json({ status: "error", message: "Email already in use" });
      }
      if (password !== confirmPassword) {
        return res
          .status(statusCodes.error)
          .json({ message: "Password and confirm password should be same!" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = await User({
        firstName,
        lastName,
        email,
        password: hashPassword,
      });

      await newUser.save();
      const token = jwt.sign(
        { userID: newUser._id },
        process.env.JWT_SCREAT_KEY,
        {
          expiresIn: "4d",
        }
      );
      return res.status(200).send({
        status: "success",
        message: "user login",
        token: token,
        username: newUser.username,
        id: newUser._id,
      });
    } catch (error) {
      res
        .status(statusCodes.error)
        .json({ massgae: "There is error", error: error });
    }
  };

  static loginUser = async (req, res) => {
    console.log(req.body)
    try {
      const { email, password } = req.body;
      const allValues = email && password;
      if (!allValues) {
        return res
          .status(statusCodes.error)
          .json({ status: "error", message: "Every fields required!" });
      }
      const findUser = await User.findOne({ email });
      if (!findUser) {
        return res.status(statusCodes.error).json({
          status: "error",
          message: "User not found please register first!",
        });
      }
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (!isMatch) {
        return res
          .status(statusCodes.error)
          .json({ message: "User email or password is incorrect!" });
      }
      if (findUser.email && isMatch) {
        const token = jwt.sign(
          { userID: findUser._id },
          process.env.JWT_SCREAT_KEY,
          {
            expiresIn: "4d",
          }
        );
        return res.status(statusCodes.success).send({
          status: "success",
          message: "user login",
          token: token,
          firstName:findUser.firstName,
          lastName:findUser.lastName,
          id: findUser._id,
        });
      }
      return res
      .status(statusCodes.success)
      .send({ status: "failed", message: "email is invalid" });
    } catch (error) {
      res
        .status(statusCodes.error)
        .json({ massgae: "There is error", error: error });
    }
  };
}

export default userController;
