import express from "express";
import {
  createUser,
  loginUser,
  getUser,
  googleLogin,
  sendOTP,
  changePasswordViaOTP,
  blockOrUnblockUser,
  getAllUsers,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", getUser);
userRouter.post("/google-login", googleLogin);
userRouter.get("/send-otp/:email", sendOTP);
userRouter.post("/change-password", changePasswordViaOTP);
userRouter.put("/block/:email", blockOrUnblockUser);
userRouter.get("/all-users", getAllUsers);

export default userRouter;
