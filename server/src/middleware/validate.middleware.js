const ApiError = require('../utils/ApiError');

// validate is a higher order function which outputs middleware function by taking schema as an input

function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(', ');
      return next(new ApiError(400, messages));
    }

    req.body = result.data;
    next();
  };
}

module.exports = validate;
