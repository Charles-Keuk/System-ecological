const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const pool   = require("../config/db");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "citoyen", phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Champs requis" });
    const [ex] = await pool.query("SELECT id FROM users WHERE email=?", [email]);
    if (ex.length) return res.status(409).json({ message: "Email déjà utilisé" });
    const hash = await bcrypt.hash(password, 10);
    const [r]  = await pool.query(
      "INSERT INTO users(name,email,password,role,phone) VALUES(?,?,?,?,?)",
      [name, email, hash, role, phone || null]
    );
    await pool.query("INSERT INTO notificationBadges(userId,unreadCount) VALUES(?,0)", [r.insertId]);
    const token = jwt.sign({ id: r.insertId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
    res.status(201).json({ token, user: { id: r.insertId, name, email, role } });
  } catch (e) { console.error(e); res.status(500).json({ message: "Erreur serveur" }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 PROTECTION 1 : body vide
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const userDB = rows[0];

    // 🔥 PROTECTION 2 : password undefined safe
    if (!userDB.password) {
      return res.status(500).json({ message: "Utilisateur corrompu (password manquant)" });
    }

    const ok = await bcrypt.compare(password, userDB.password);

    if (!ok) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const { password: _, ...user } = userDB;

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    // 🔥 PROTECTION 3 : session insert sécurisé
    try {
      await pool.query(
        "INSERT INTO sessions(userId,token,ipAddress,device,expiresAt) VALUES(?,?,?,?,DATE_ADD(NOW(),INTERVAL 7 DAY))",
        [
          user.id,
          token,
          req.ip || null,
          req.headers["user-agent"]?.substring(0, 255) || "unknown",
        ]
      );
    } catch (sessionErr) {
      console.log("SESSION ERROR (non bloquant):", sessionErr.message);
    }

    return res.json({ token, user });

  } catch (e) {
    
    console.log("LOGIN ERROR:", e);
    return res.status(500).json({
      message: "Erreur serveur",
      error: e.message,
    });
  }
};

exports.me = (req, res) => res.json(req.user);

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    await pool.query("DELETE FROM sessions WHERE token=?", [token]);
    res.json({ message: "Déconnecté" });
  } catch { res.status(500).json({ message: "Erreur" }); }
};
