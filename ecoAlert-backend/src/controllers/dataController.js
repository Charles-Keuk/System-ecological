const pool = require("../config/db");

/* ═══ INTERVENTIONS ═══ */
exports.createIntervention = async (req, res) => {
  try {
    const { alerteId } = req.body;
    const chauffeurId  = req.user.id;
    // Vérifier pas déjà prise
    const [ex] = await pool.query(
      "SELECT id FROM interventions WHERE alerteId=? AND statut='enCours'", [alerteId]);
    if (ex.length) return res.status(409).json({ message: "Alerte déjà prise en charge" });
    const [r] = await pool.query(
      "INSERT INTO interventions(alerteId,chauffeurId,dateDebut,statut) VALUES(?,?,NOW(),'enCours')",
      [alerteId, chauffeurId]
    );
    await pool.query("UPDATE alertes SET statut='enCours' WHERE id=?", [alerteId]);
    // Notifier le citoyen
    const [[alerte]] = await pool.query("SELECT userId FROM alertes WHERE id=?", [alerteId]);
    await pool.query(
      "INSERT INTO notifications(userId,type,titre,message,relatedId) VALUES(?,?,?,?,?)",
      [alerte.userId,"alerte","Alerte prise en charge",
       "Un chauffeur prend en charge votre signalement",alerteId]
    );
    // Log
    await pool.query("INSERT INTO logs(userId,action) VALUES(?,?)",
      [chauffeurId, `Intervention démarrée #${r.insertId}`]);
    res.status(201).json({ id: r.insertId });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.terminerIntervention = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "UPDATE interventions SET statut='terminee', dateFin=NOW() WHERE id=? AND chauffeurId=?",
      [id, req.user.id]
    );
    const [[interv]] = await pool.query("SELECT alerteId FROM interventions WHERE id=?", [id]);
    await pool.query("UPDATE alertes SET statut='traite', resolvedAt=NOW() WHERE id=?",
      [interv.alerteId]);
    // MAJ stats chauffeur
    await pool.query(`
      INSERT INTO chauffeurStats(chauffeurId,totalInterventions,tempsMoyen,performanceScore)
      VALUES(?,1,30,80)
      ON DUPLICATE KEY UPDATE
        totalInterventions=totalInterventions+1,
        performanceScore=LEAST(100, performanceScore+2)
    `, [req.user.id]);
    res.json({ message: "Intervention terminée" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getInterventions = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    let sql = `
      SELECT i.*, a.description, a.priorite, a.latitude, a.longitude,
             z.name AS zone, u.name AS chauffeurName, c.name AS citoyenName
      FROM interventions i
      JOIN alertes a ON a.id=i.alerteId
      LEFT JOIN zones z ON z.id=a.zoneId
      JOIN users u ON u.id=i.chauffeurId
      JOIN users c ON c.id=a.userId
    `;
    const args = [];
    if (!isAdmin) { sql += " WHERE i.chauffeurId=?"; args.push(req.user.id); }
    sql += " ORDER BY i.dateDebut DESC LIMIT 50";
    const [rows] = await pool.query(sql, args);
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

/* ═══ RAPPORTS ═══ */
exports.createRapport = async (req, res) => {
  try {
    const { dateRapport, resume, totalCollecte, observations } = req.body;
    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const [r] = await pool.query(
      "INSERT INTO rapports(chauffeurId,dateRapport,resume,totalCollecte,observations,pdfUrl) VALUES(?,?,?,?,?,?)",
      [req.user.id, dateRapport, resume, totalCollecte||0, observations, pdfUrl]
    );
    // Notifier admins
    const [admins] = await pool.query("SELECT id FROM users WHERE role='admin'");
    for (const a of admins) {
      await pool.query(
        "INSERT INTO notifications(userId,type,titre,message,relatedId) VALUES(?,?,?,?,?)",
        [a.id,"rapport","Nouveau rapport","Un chauffeur a soumis un rapport d'intervention",r.insertId]
      );
    }
    res.status(201).json({ id: r.insertId });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getRapports = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    let sql = `
      SELECT r.*, u.name AS chauffeurName,
             rc.statut AS confirmation, rc.dateAction
      FROM rapports r JOIN users u ON u.id=r.chauffeurId
      LEFT JOIN rapportConfirmations rc ON rc.rapportId=r.id
    `;
    const args = [];
    if (!isAdmin) { sql += " WHERE r.chauffeurId=?"; args.push(req.user.id); }
    sql += " ORDER BY r.createdAt DESC LIMIT 50";
    const [rows] = await pool.query(sql, args);
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.validerRapport = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body; // 'lu' | 'valide'
    await pool.query(
      `INSERT INTO rapportConfirmations(rapportId,adminId,statut)
       VALUES(?,?,?) ON DUPLICATE KEY UPDATE statut=?,dateAction=NOW()`,
      [id, req.user.id, statut, statut]
    );
    await pool.query("UPDATE rapports SET status=? WHERE id=?", [statut, id]);
    res.json({ message: "Rapport mis à jour" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

/* ═══ NOTIFICATIONS ═══ */
exports.getNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM notifications WHERE userId=?
      ORDER BY createdAt DESC LIMIT 30
    `, [req.user.id]);
    const [[badge]] = await pool.query(
      "SELECT unreadCount FROM notificationBadges WHERE userId=?", [req.user.id]);
    res.json({ notifications: rows, unread: badge?.unreadCount || 0 });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.markRead = async (req, res) => {
  try {
    await pool.query("UPDATE notifications SET isRead=TRUE WHERE userId=?", [req.user.id]);
    await pool.query("UPDATE notificationBadges SET unreadCount=0 WHERE userId=?", [req.user.id]);
    res.json({ message: "Notifications lues" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

/* ═══ ZONES ═══ */
exports.getZones = async (req, res) => {
  try {
    const [zones] = await pool.query(`
      SELECT z.*, COUNT(a.id) AS totalAlertes,
             SUM(a.statut='enAttente') AS enAttente
      FROM zones z LEFT JOIN alertes a ON a.zoneId=z.id
      GROUP BY z.id
    `);
    res.json(zones);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createZone = async (req, res) => {
  try {
    const [r] = await pool.query(
      "INSERT INTO zones(name,description) VALUES(?,?)",
      [req.body.name, req.body.description||null]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

/* ═══ USERS (admin) ═══ */
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id,u.name,u.email,u.role,u.phone,u.createdAt,
             COALESCE(cs.totalInterventions,0) AS interventions,
             COALESCE(cs.performanceScore,0) AS score
      FROM users u LEFT JOIN chauffeurStats cs ON cs.chauffeurId=u.id
      WHERE u.role != 'admin'
      ORDER BY u.createdAt DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
};
