import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

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
      }
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
        process.env.JWT_SECRET
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
        process.env.JWT_SECRET
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
