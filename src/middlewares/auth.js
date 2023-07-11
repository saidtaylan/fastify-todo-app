import { verifyJWT } from "../helpers.js";

export const authenticate = (req, reply, done) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    throw new Error("Token is not valid");
  }
  try {
    const user = verifyJWT(token, "test");
    req.user = user;
    done();
  } catch (error) {
    throw new Error(error.message);
  }
};
