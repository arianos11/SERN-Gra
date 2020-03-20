const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

// @route   GET api/users
// @desc    Register user
// @access  Public

router.post('/', [
    check("username", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 8 })
  ], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        
        db.query(
            `SELECT email FROM users WHERE email = '${email}'`,
            async (err, result) => {
              if (err) { console.log(err);res.status(500).send("Server error")}
              // Check user exists
              else if (result.length > 0)
                res.status(400).json({ errors: [{ msg: "User already exists" }] });
              else {
                // Hasing password
                const salt = await bcrypt.genSalt(10);
                const passwordHashed = await bcrypt.hash(password, salt);
    
                const user = {
                  username: username,
                  email: email,
                  password: passwordHashed,
                  verified: 1,
                  created: new Date(),
                  passwordDate: new Date(), 
                  image: "./userImage/default.png",
                };
    
                // Send user to database
                await db.query("INSERT INTO users SET ?", user);
    
                // Auth user
    
                await db.query(
                  `SELECT id, email FROM users WHERE email = '${email}'`,
                  async (err, result) => {
                    if (err) res.status(500).send("Server error");
                    else if (result.length === 0)
                    res.status(400).json({ errors: [{ msg: "Auth user not find" }] });
                    else {
                      const user = result[0];
                      console.log(result);
    
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
                          if (err) res.status(500).send("Server error");
                          else res.status(200).json({ token });
                        }
                      );
                    }
                  }
                );
              }
            }
          );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
  });

  module.exports = router;