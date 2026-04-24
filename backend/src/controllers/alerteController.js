const pool   = require("../config/db");
const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

const storage = multer.diskStorage({
  destination: (_, __, cb) => { const d="uploads/"; fs.mkdirSync(d,{recursive:true}); cb(null,d); },
  filename:    (_, f, cb)  => cb(null, Date.now() + path.extname(f.originalname)),
});
exports.upload = multer({ storage, limits: { fileSize: 5e6 } });

/* ─── Créer alerte (citoyen) ─── */
exports.create = async (req, res) => {
  try {
    const { description, latitude, longitude, zoneId, priorite="moyenne" } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const [r] = await pool.query(
      `INSERT INTO alertes(userId,zoneId,description,imageUrl,latitude,longitude,priorite)
       VALUES(?,?,?,?,?,?,?)`,
      [req.user.id, zoneId||null, description, imageUrl, latitude, longitude, priorite]
    );
    // Notifier les chauffeurs de la zone
    if (zoneId) {
      const [chauf] = await pool.query(
        "SELECT chauffeurId FROM chauffeurZones WHERE zoneId=?", [zoneId]);
      for (const c of chauf) {
        await pool.query(
          `INSERT INTO notifications(userId,type,titre,message,relatedId)
           VALUES(?,?,?,?,?)`,
          [c.chauffeurId,"alerte","Nouvelle alerte",
           `Alerte ${priorite} signalée dans votre zone`, r.insertId]
        );
        await pool.query(
          "UPDATE notificationBadges SET unreadCount=unreadCount+1 WHERE userId=?",
          [c.chauffeurId]
        );
      }
    }
    // Log
    await pool.query("INSERT INTO logs(userId,action) VALUES(?,?)",
      [req.user.id, `Alerte créée #${r.insertId}`]);
    res.status(201).json({ id: r.insertId, message: "Alerte envoyée" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

/* ─── Liste alertes ─── */
exports.getAll = async (req, res) => {
  try {
    const { statut, priorite, zoneId, limit=50, offset=0 } = req.query;
    let sql = `
      SELECT a.*, u.name AS citoyenName, z.name AS zoneName
      FROM alertes a
      JOIN users u ON u.id=a.userId
      LEFT JOIN zones z ON z.id=a.zoneId
      WHERE 1=1
    `;
    const args = [];
    if (statut)   { sql += " AND a.statut=?";   args.push(statut); }
    if (priorite) { sql += " AND a.priorite=?"; args.push(priorite); }
    if (zoneId)   { sql += " AND a.zoneId=?";   args.push(zoneId); }
    // citoyen ne voit que les siennes
    if (req.user.role === "citoyen") { sql += " AND a.userId=?"; args.push(req.user.id); }
    sql += ` ORDER BY a.createdAt DESC LIMIT ? OFFSET ?`;
    args.push(+limit, +offset);
    const [rows] = await pool.query(sql, args);

    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM alertes");
    res.json({ data: rows, total });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

/* ─── Détail alerte ─── */
exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, u.name AS citoyenName, z.name AS zoneName,
             i.id AS interventionId, i.statut AS intStatut,
             ch.name AS chauffeurName
      FROM alertes a
      JOIN users u ON u.id=a.userId
      LEFT JOIN zones z ON z.id=a.zoneId
      LEFT JOIN interventions i ON i.alerteId=a.id
      LEFT JOIN users ch ON ch.id=i.chauffeurId
      WHERE a.id=?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Alerte introuvable" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

/* ─── Mettre à jour statut ─── */
exports.updateStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    const updates = { statut };
    if (statut === "traite") updates.resolvedAt = new Date();
    await pool.query("UPDATE alertes SET ?,  updatedAt=NOW() WHERE id=?",
      [updates, req.params.id]);
    res.json({ message: "Statut mis à jour" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

/* ─── Alertes sur carte ─── */
exports.getMapAlerts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.latitude, a.longitude, a.statut, a.priorite,
             a.description, z.name AS zone, u.name AS citoyen, a.createdAt
      FROM alertes a
      JOIN users u ON u.id=a.userId
      LEFT JOIN zones z ON z.id=a.zoneId
      WHERE a.latitude IS NOT NULL AND a.statut != 'traite'
      ORDER BY a.priorite DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
};
