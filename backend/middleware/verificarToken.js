// middleware/verificarToken.js
import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro");
    req.user = decoded; // Cambio a req.user para ser consistente
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
}
