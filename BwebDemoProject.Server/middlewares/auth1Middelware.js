import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "No Token",
    });
  }

  try {
    const verified = jwt.verify(
      token,
      "MY_SECRET_KEY"
    );

    req.user = verified;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

export default authMiddleware;