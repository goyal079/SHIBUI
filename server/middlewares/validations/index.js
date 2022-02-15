import { body, validationResult } from "express-validator";

function productRules() {
  return [
    body("name", "Enter name for the product").notEmpty().isString(),
    body("description", "Enter product description").notEmpty().isString(),
    body("price", "Enter product price")
      .notEmpty()
      .isNumeric()
      .length({ max: 8 }),
    body("images", "Give Product Images").isArray().notEmpty(),
    body("category", "Product description can't be empty")
      .notEmpty()
      .isString(),
  ];
}

function registrationRules() {
  return [
    body("name", "Enter name for the product").notEmpty().isString(),
    body("email", "Enter User Email").notEmpty().isEmail(),
    body("password", "Password must be atleast 6 characters long")
      .isString()
      .notEmpty()
      .isLength({ min: 6 }),
  ];
}
function errorMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
}
function userLoginValidations() {
  return [
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter a password").notEmpty().isString(),
  ];
}
function reviewValidations() {
  return [
    body("rating", "Enter rating").isNumeric(),
    body("comment", "Enter a comment").notEmpty().isString(),
    body("productId", "Enter a product Id").notEmpty().isString(),
  ];
}
export {
  errorMiddleware,
  registrationRules,
  productRules,
  userLoginValidations,
  reviewValidations,
};
