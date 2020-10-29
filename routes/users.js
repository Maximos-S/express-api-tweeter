const express = require("express")
const { check } = require("express-validator");
const { asyncHandler, handleValidationErrors } = require('../utils')
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { getUserToken } = require("../auth.js");
const  db  = require("../db/models")
const { User } = db

const validateUsername =
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a username");

const validateEmailAndPassword = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors
];

router.post("/", validateUsername, validateEmailAndPassword, asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await User.create({username, email, hashedPassword})

  // Generated Token
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJlbWFpbCI6Im1heEBtYXguY29tIn0sImlhdCI6MTYwMzk5MTc5OSwiZXhwIjoxNjA0NTk2NTk5fQ._N0HpzmF2Nb-nQ7rKbfIfxnkL-ftGsDK3ZBOCLTPdAE"

    const token = getUserToken(user);
    res.status(201).json({
        user: { id: user.id },
        token,
    });
    //to generate json
        
}))

module.exports = router