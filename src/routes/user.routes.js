import express from "express";
import userController from "../controller/user.controller.js";

const userRoutes = express.Router();

userRoutes
  .post("/", userController.createUser)
  .post("/login", userController.loginUser);

export default userRoutes;
