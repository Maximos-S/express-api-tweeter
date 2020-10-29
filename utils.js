const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    // TODO: Generate error object and invoke next middleware function
    const errors = validationErrors.array().map((error) => error.msg)

    if(!validationErrors.isEmpty()) {
        const err = Error("Bad request.");
    
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        return next(err)

    }

    next();
};

const asyncHandler = (handler) => (req, res, next) => {
    handler(req, res, next).catch(next);
}

module.exports = { handleValidationErrors, asyncHandler}