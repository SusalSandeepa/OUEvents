import User from "../models/user.js";
import OTP from "../models/otpModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getOTPEmail } from "../utils/otpEmail.js";

dotenv.config();

//Create a transporter to send emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Bypass SSL certificate issues
  },
});

export async function createUser(req, res) {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({
        message: "This email already exists, please login",
      });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
    });

    await user.save();
    res.json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Failed to create user", error);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
}

export function loginUser(req, res) {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user == null) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      const isPasswordMatching = bcrypt.compareSync(
        req.body.password,
        user.password,
      ); // Compare the provided password with the hashed password
      if (isPasswordMatching) {
        // Check if user is blocked BEFORE generating token
        if (user.isBlock) {
          res.status(403).json({
            message: "Your account has been blocked. Please contact admin.",
          });
          return;
        }

        const token = jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            image: user.image,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }, // Token expires in 7 days
        );

        res.json({
          message: "Login successful",
          token: token,
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            image: user.image,
          },
        });
      } else {
        res.status(401).json({
          message: "Incorrect password",
        });
      }
    }
  });
}

export function isAdmin(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.role != "admin") {
    return false;
  }

  return true;
}

export function isUser(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.role != "user") {
    return false;
  }

  return true;
}

export async function blockOrUnblockUser(req, res) {
  if (!isAdmin(req)) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  // make sure admin cannot block or unblock himself
  if (req.user.email == req.body.email) {
    res.status(400).json({
      message: "You cannot block or unblock yourself",
    });
    return;
  }

  try {
    //update user isBlock status
    await User.updateOne(
      {
        email: req.params.email,
      },
      {
        isBlock: req.body.isBlock,
      },
    );
    res.json({
      message: "User blocked or unblocked successfully",
    });
  } catch (error) {
    console.error("Failed to block or unblock user", error);
    res.status(500).json({
      message: "Failed to block or unblock user",
    });
  }
}

//Get user details from token
export async function getUser(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  // Fetch fresh user data from database
  try {
    const user = await User.findOne({ email: req.user.email });
    if (user == null) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    res.json({
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user details",
    });
  }
}

//Google login
export async function googleLogin(req, res) {
  const token = req.body.token;

  if (token == null) {
    res.status(400).json({
      message: "Token is required",
    });
    return;
  }

  //Get user details by sending the user token to google
  try {
    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const googleUser = googleResponse.data;
    //Check if user exists
    const user = await User.findOne({
      email: googleUser.email,
    });

    if (user == null) {
      //Create a new user
      const user = new User({
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        password: "Hidden",
        isEmailVerified: googleUser.email_verified,
        image: googleUser.picture,
      });
      let savedUser = await user.save();
      // Generate a JWT token when a new user is created
      const jwtToken = jwt.sign(
        {
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          role: savedUser.role,
          isEmailVerified: savedUser.isEmailVerified,
          image: savedUser.image,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.json({
        message: "Google login successful",
        token: jwtToken,
        user: {
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          role: savedUser.role,
          isEmailVerified: savedUser.isEmailVerified,
          image: savedUser.image,
        },
      });
      return;
    } else {
      // Check if existing user is blocked
      if (user.isBlock) {
        res.status(403).json({
          message: "Your account has been blocked. Please contact admin.",
        });
        return;
      }

      // Generate a JWT token when a user logs in
      const jwtToken = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          image: user.image,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.json({
        message: "Google login successful",
        token: jwtToken,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          image: user.image,
        },
      });
      return;
    }
  } catch (error) {
    console.error("Google login failed", error);
    res.status(500).json({
      message: "Google login failed",
    });
  }
}

//Send OTP to user's email
export async function sendOTP(req, res) {
  const email = req.params.email;

  if (email == null) {
    res.status(400).json({
      message: "Email is required",
    });
    return;
  }

  //Generate a random OTP between 10000 to 99999
  const otp = Math.floor(Math.random() * 90000) + 10000;

  try {
    //Delete previous OTPs
    await OTP.deleteMany({ email: email });

    //Save new OTP
    const newOTP = new OTP({
      email: email,
      otp: otp,
    });
    await newOTP.save();

    //Send OTP to user's email
    await transporter.sendMail({
      from: {
        name: "OUEvents",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "🔐 Your OUEvents Password Reset Code",
      text: `Your OTP for password reset is: ${otp}. This code expires in 10 minutes.`,
      html: getOTPEmail(otp),
    });

    res.json({
      message: "OTP sent successfully",
    });
    return;
  } catch (error) {
    console.error("Failed to send OTP", error);
    res.status(500).json({
      message: "Failed to send OTP",
    });
    return;
  }
}

//Change password via OTP
export async function changePasswordViaOTP(req, res) {
  const email = req.body.email;
  const otp = req.body.otp;
  const newPassword = req.body.newPassword;

  try {
    //Check if OTP is valid
    const otpRecord = await OTP.findOne({
      email: email,
      otp: otp,
    });

    if (otpRecord == null) {
      res.status(400).json({
        message: "Invalid OTP",
      });
      return;
    }

    //Delete OTP when password is changed
    await OTP.deleteMany({ email: email });

    //Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne({ email: email }, { password: hashedPassword });
    res.json({
      message: "Password changed successfully",
    });
    return;
  } catch (error) {
    console.error("Failed to change password", error);
    res.status(500).json({
      message: "Failed to change password",
    });
    return;
  }
}

export async function getAllUsers(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Failed to get users",
    });
  }
}
