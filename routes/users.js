const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const uuid = require("uuid")
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
      if(errors.param === "email") return res.status(400).json([{ text: "Proszę podać poprawny adres email", type: "fail" }]);
      else if(errors.param === "username") return res.status(400).json([{ text: "Nazwa użytkownika jest wymagana", type: "fail" }]);
      else return res.status(400).json([{ text: "Hasło musi zawierać 8 lub więcej znaków", type: "fail" }]);
    };

    const { username, email, password } = req.body;

    try {
        
        db.query(
            `SELECT email FROM users WHERE email = '${email}'`,
            async (err, result) => {
              if (err) { console.log(err);res.status(500).json([{ text: "Błąd serwera", type: "fail" }]);}
              // Check user exists
              else if (result.length > 0)
                res.status(400).json([{ text: "Ten użytkownik jest już zarejestrowany", type: "fail" }]);
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
                  image: uuid.v4(),
                };
    
                // Send user to database
                await db.query("INSERT INTO users SET ?", user);
    
                // Auth user
    
                await db.query(
                  `SELECT id, email FROM users WHERE email = '${email}'`,
                  async (err, result) => {
                    if (err) res.status(500).json([{ text: "Błąd serwera", type: "fail" }]);
                    else if (result.length === 0)
                    res.status(400).json([{ text: "Ten użytkownik nie istnieje", type: "fail" }]);
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
                          if (err) res.status(500).json([{ text: "Błąd serwera", type: "fail" }]);
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
        res.status(500).json([{ text: "Błąd serwera", type: "fail" }]);
    }
  });

  module.exports = router;