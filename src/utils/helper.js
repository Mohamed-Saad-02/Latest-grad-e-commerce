import jwt from "jsonwebtoken";

export function generateToken(
  payload,
  secret = process.env.JWT_SECRET,
  expiresIn = process.env.JWT_EXPIRES_IN,
  options = {}
) {
  const token = jwt.sign(payload, secret, {
    expiresIn,
    ...options,
  });
  return token;
}
