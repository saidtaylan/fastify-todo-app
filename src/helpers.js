import jwt from "jsonwebtoken";

export const signJWT = (data) => {
  return jwt.sign(data, "test", { expiresIn: "24h" });
};

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, "test");
  return decoded;
};

export const excludeFields = (obj, fields) => {
  const newObj = { ...obj };
  fields.forEach((field) => {
    delete newObj[field];
  });
  return newObj;
};
