const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);

      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: errorMessage,
      });
    }

    req.body = value;

    next();
  };
};

export default validateSchema;
