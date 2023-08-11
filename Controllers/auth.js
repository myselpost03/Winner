import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = (req, res) => {
  const { username, password } = req.body;
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [username], (err, data) => {
    if (err) {
      console.log("Error checking if user exists: ", err);
      res.status(500).send("Server error");
    } else if (data.length > 0) {
      console.log("User already exists");
      res.status(409).send("User already exists");
    } else {
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.log("Error hashing password: ", err);
          res.status(500).send("Server error");
        } else {
          const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
          const values = [username, hashedPassword];
          db.query(sql, values, (err, data) => {
            if (err) {
              console.log("Error inserting user data into database: ", err);
              res.status(500).send("Server error");
            } else {
              console.log("User registered successfully!");
              res.send("User registered successfully!");
            }
          });
        }
      });
    }
  });
};

export const login = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, secretKey);

    const { password, ...others } = data[0];

    {/*res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "none",
        secure: false,
        expires: new Date("9999-12-31"),
        domain: 'localhost',
        path: '/'
      })
      .status(200)
    .json(others);*/}
    res.status(200).json({ accessToken: token, user: others });
  });
};

export const logout = (req, res) => {
{/*  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
  .json("User has been logged out!");*/}
  res.status(200).json({ message: "Logout successful" })
};
