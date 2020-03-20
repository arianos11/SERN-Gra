const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const sendMail = require("../utils/email");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

// @route   GET api/auth
// @desc    Take data about user
// @access  Private

router.get("/", auth, (req, res) => {
  try {
    db.query(
      `SELECT id, username, email, image, created FROM users WHERE id = ${req.user.id}`,
      (err, result) => {
        res.json(result);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth
// @desc    Login user
// @access  Public

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      db.query(
        `SELECT id, email, password FROM users WHERE email = '${email}'`,
        async (err, result) => {
          if (err) {
            console.log(err);
            res.code(500), json("Server error");
          } else if (result.length === 0) {
            res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
          }

          const user = result[0];

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            return res
              .status(400)
              .json({ errors: [{ msg: "Invalid Credentials" }] });
          }

          const payload = {
            user: {
              id: user.id
            }
          };

          jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/auth/emailVerification
// @desc    Send email with verification link
// @access  Private

router.get("/emailVerification", auth, (req, res) => {
  const user = req.user;
  const token = req.token;
  console.log(user);

  db.query(
    `SELECT email FROM users WHERE id = ${user.id}`,
    async (err, result) => {
      if (err) {
        console.log(err);
        res.code(500).json("Server error");
      } else {
        const text = `Your verification link: localhost:5000/api/auth/emailVerification/${token}`;
        const html = `Your verification link: <b>localhost:5000/api/auth/emailVerification/${token}</b>`;

        await sendMail(result[0].email, "Email Verification", text, html);
        res.status(200).json({ msg: "Email send" });
      }
    }
  );
});

// @route   POST api/auth/emailVerification/:token
// @desc    Check verification link
// @access  Private

router.post("/emailVerification/:token", (req, res) => {
  const { token } = req.params;

    try {
      const decoded = jwt.verify(token, config.get("jwtSecret"));
      if (decoded) {
        db.query(
          `UPDATE users SET verified = 1 WHERE id = ${decoded.user.id}`,
          err => {
            if (err) {
              console.log(err);
              res.code(500).json("Server error");
            }
            res.status(200).json( { msg: 'Email verified' } )
          }
        );
      }
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  }
);

module.exports = router;
