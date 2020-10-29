const express = require('express')
const app = require('../app')
const db = require("../db/models")
const { Tweet } = db;
const router = express.Router()
const { check } = require("express-validator");
const { asyncHandler, handleValidationErrors} = require("../utils");
const tweetValidators = [
    check("message")
    .exists({checkFalsy : true})
    .withMessage('Please provide a message')
    .isLength({max : 280})
    .withMessage('you moron, how could you mess this up?')
]



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


router.post("/", tweetValidators, handleValidationErrors, asyncHandler(async (req, res) => {
    const { message } = req.body

    const newTweet = await Tweet.build()

    newTweet.message = message;

    await newTweet.save();

    res.redirect("/")
}))

router.put("/:id(\\d+)", tweetValidators, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id, 10)

    const { message } = req.body

    const tweet = await Tweet.findByPk(tweetId)

    if (tweet) {

        tweet.message = message;

        await tweet.save();

        res.redirect("/")
    } else {
        next(tweetNotFoundError(tweetId))
    }


}))

router.delete("/:id(\\d+)", asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id, 10)

    const tweet = await Tweet.findByPk(tweetId)
    console.log(tweet)
    if (tweet) {
        await tweet.destroy()

        res.redirect("/")
    } else {
        next(tweetNotFoundError(tweetId))
    }
}))


module.exports = router 