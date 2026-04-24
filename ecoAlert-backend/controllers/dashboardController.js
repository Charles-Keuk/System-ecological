const pool = require("../config/db");

/* ═══ ADMIN DASHBOARD ═══ */
exports.getAdminDashboard = async (req, res) => {
  try {
    // Stats globales
    const [[totals]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM alertes) AS totalAlertes,
        (SELECT COUNT(*) FROM alertes WHERE statut='enAttente') AS enAttente,
        (SELECT COUNT(*) FROM alertes WHERE statut='enCours') AS enCours,
        (SELECT COUNT(*) FROM alertes WHERE statut='traite') AS traites,
        (SELECT COUNT(*) FROM alertes WHERE DATE(createdAt)=CURDATE()) AS alertesAujourdhui,
        (SELECT COUNT(*) FROM users WHERE role='citoyen') AS totalCitoyens,
        (SELECT COUNT(*) FROM users WHERE role='chauffeur') AS totalChauffeurs,
        (SELECT COUNT(*) FROM interventions WHERE statut='enCours') AS interventionsActives,
        (SELECT COUNT(*) FROM rapports WHERE DATE(createdAt)=CURDATE()) AS rapportsAujourdhui
    `);

    // Alertes par priorité
    const [parPriorite] = await pool.query(`
      SELECT priorite, COUNT(*) AS count FROM alertes GROUP BY priorite
    `);

    // Alertes par zone (top 5)
    const [parZone] = await pool.query(`
      SELECT z.name AS zone, COUNT(a.id) AS count, 
             SUM(a.statut='traite') AS traites
      FROM zones z LEFT JOIN alertes a ON a.zoneId=z.id
      GROUP BY z.id ORDER BY count DESC LIMIT 8
    `);

    // Évolution 7 derniers jours
    const [evolution7j] = await pool.query(`
      SELECT DATE(createdAt) AS jour,
             COUNT(*) AS total,
             SUM(statut='traite') AS traites,
             SUM(statut='enAttente') AS enAttente
      FROM alertes
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(createdAt) ORDER BY jour
    `);

    // Top chauffeurs
    const [topChauffeurs] = await pool.query(`
      SELECT u.name, u.id,
             COALESCE(cs.totalInterventions,0) AS interventions,
             COALESCE(cs.performanceScore,0) AS score,
             COALESCE(cs.tempsMoyen,0) AS tempsMoyen
      FROM users u
      LEFT JOIN chauffeurStats cs ON cs.chauffeurId=u.id
      WHERE u.role='chauffeur'
      ORDER BY interventions DESC LIMIT 5
    `);

    // Alertes récentes
    const [recentAlerts] = await pool.query(`
      SELECT a.*, u.name AS citoyenName, z.name AS zoneName
      FROM alertes a
      JOIN users u ON u.id=a.userId
      LEFT JOIN zones z ON z.id=a.zoneId
      ORDER BY a.createdAt DESC LIMIT 10
    `);

    // Stats journalières (30 jours)
    const [statsJours] = await pool.query(`
      SELECT date, totalAlertes, totalCollectes FROM statsJournalieres
      ORDER BY date DESC LIMIT 30
    `);

    // Zones actives
    const [zones] = await pool.query("SELECT * FROM zones");

    res.json({
      totals,
      parPriorite,
      parZone,
      evolution7j,
      topChauffeurs,
      recentAlerts,
      statsJours,
      zones,
    });
  } catch (e) { console.error(e); res.status(500).json({ message: e.message }); }
};

/* ═══ STATS CHAUFFEUR ═══ */
exports.getChauffeurDashboard = async (req, res) => {
  try {
    const id = req.user.id;

    const [[stats]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM interventions WHERE chauffeurId=?) AS totalInterventions,
        (SELECT COUNT(*) FROM interventions WHERE chauffeurId=? AND statut='enCours') AS enCours,
        (SELECT COUNT(*) FROM interventions WHERE chauffeurId=? AND DATE(dateDebut)=CURDATE()) AS aujourd_hui,
        COALESCE((SELECT performanceScore FROM chauffeurStats WHERE chauffeurId=?),0) AS score,
        COALESCE((SELECT tempsMoyen FROM chauffeurStats WHERE chauffeurId=?),0) AS tempsMoyen
    `, [id,id,id,id,id]);

    const [mesAlertes] = await pool.query(`
      SELECT a.*, z.name AS zoneName, u.name AS citoyenName
      FROM interventions i
      JOIN alertes a ON a.id=i.alerteId
      LEFT JOIN zones z ON z.id=a.zoneId
      JOIN users u ON u.id=a.userId
      WHERE i.chauffeurId=?
      ORDER BY i.dateDebut DESC LIMIT 20
    `, [id]);

    const [mesZones] = await pool.query(`
      SELECT z.* FROM chauffeurZones cz JOIN zones z ON z.id=cz.zoneId
      WHERE cz.chauffeurId=?
    `, [id]);

    const [alertesZone] = await pool.query(`
      SELECT a.*, u.name AS citoyenName, z.name AS zoneName
      FROM alertes a
      JOIN users u ON u.id=a.userId
      LEFT JOIN zones z ON z.id=a.zoneId
      WHERE a.zoneId IN (SELECT zoneId FROM chauffeurZones WHERE chauffeurId=?)
        AND a.statut='enAttente'
      ORDER BY a.priorite DESC, a.createdAt ASC LIMIT 15
    `, [id]);

    res.json({ stats, mesAlertes, mesZones, alertesZone });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
