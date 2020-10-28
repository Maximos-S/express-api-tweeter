const express = require('express')
const app = require('../app')
const db = require("../db/models")
const { Tweet } = db;
const router = express.Router()
const { check, validationResult } = require("express-validator");
const tweetValidators = [
    check("message")
    .exists({checkFalsy : true})
    .withMessage('Please provide a message')
    .isLength({max : 280})
    .withMessage('you moron, how could you mess this up?')
]

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    // TODO: Generate error object and invoke next middleware function
    

};

const asyncHandler = (handler) => (req, res, next) => {
    handler(req, res, next).catch(next);
}

const tweetNotFoundError = (tweetId) => {
    const error = new Error(`Your tweet with the ${tweetId} id: was not found`)
    error.title = 'Tweet not found'
    error.status = 404
    return error
}





router.get("/", asyncHandler( async (req, res) => {
   const tweets =  await Tweet.findAll({})
    res.json({tweets})
}),
)

router.get("/:id(\\d+)", asyncHandler( async (req, res, next) => {
    const tweetId = parseInt(req.params.id, 10)
    const tweet = await Tweet.findByPk(tweetId)
    if (tweet) res.json({tweet})
    next(tweetNotFoundError(tweetId))
})
)


router.post("/", )








module.exports = router 