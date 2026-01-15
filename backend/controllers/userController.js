import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export function createUser(req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10); // Hash the password with a salt round of 10

  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
  });

  user
    .save()
    .then(() => {
      res.json({
        message: "User created successfully",
      });
    })
    .catch(() => {
      res.json({
        message: "Failed to create user",
      });
    });
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
        user.password
      ); // Compare the provided password with the hashed password
      if (isPasswordMatching) {
        const token = jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          },
          process.env.JWT_SECRET
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

//Get user details from token
export function getUser(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  } else {
    res.json({
      user: req.user,
    });
  }
}
