const jwt  = require("jsonwebtoken");
const pool = require("../config/db");

const auth = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (!h?.startsWith("Bearer ")) return res.status(401).json({ message: "Token manquant" });
    const decoded = jwt.verify(h.split(" ")[1], process.env.JWT_SECRET);
    const [rows] = await pool.query("SELECT id,name,email,role,phone FROM users WHERE id=?", [decoded.id]);
    if (!rows.length) return res.status(401).json({ message: "Utilisateur introuvable" });
    req.user = rows[0];
    next();
  } catch { res.status(401).json({ message: "Token invalide" }); }
};

const role = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({ message: "Accès refusé" });

module.exports = { auth, role };
