const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { auth, role }     = require("../middleware/auth");
const authCtrl           = require("../controllers/authController");
const dashCtrl           = require("../controllers/dashboardController");
const alerteCtrl         = require("../controllers/alerteController");
const {
  createIntervention, terminerIntervention, getInterventions,
  createRapport, getRapports, validerRapport,
  getNotifications, markRead,
  getZones, createZone, getUsers,
} = require("../controllers/dataController");

/* ── AUTH ── */
router.post("/auth/register", authCtrl.register);
router.post("/auth/login",    authCtrl.login);
router.get ("/auth/me",       auth, authCtrl.me);
router.post("/auth/logout",   auth, authCtrl.logout);

/* ── DASHBOARD ── */
router.get("/dashboard/admin",    auth, role("admin"),    dashCtrl.getAdminDashboard);
router.get("/dashboard/chauffeur",auth, role("chauffeur"),dashCtrl.getChauffeurDashboard);

/* ── ALERTES ── */
router.get ("/alertes",           auth, alerteCtrl.getAll);
router.get ("/alertes/map",       auth, alerteCtrl.getMapAlerts);
router.get ("/alertes/:id",       auth, alerteCtrl.getOne);
router.post("/alertes",           auth, alerteCtrl.upload.single("image"), alerteCtrl.create);
router.patch("/alertes/:id/statut", auth, role("admin","chauffeur"), alerteCtrl.updateStatus);

/* ── INTERVENTIONS ── */
router.get ("/interventions",           auth, getInterventions);
router.post("/interventions",           auth, role("chauffeur"), createIntervention);
router.patch("/interventions/:id/fin",  auth, role("chauffeur"), terminerIntervention);

/* ── RAPPORTS ── */
router.get ("/rapports",             auth, getRapports);
router.post("/rapports",             auth, role("chauffeur"), upload.single("pdf"), createRapport);
router.patch("/rapports/:id/valider",auth, role("admin"), validerRapport);

/* ── NOTIFICATIONS ── */
router.get  ("/notifications",      auth, getNotifications);
router.patch("/notifications/read", auth, markRead);

/* ── ZONES ── */
router.get ("/zones",   auth, getZones);
router.post("/zones",   auth, role("admin"), createZone);

/* ── USERS ── */
router.get("/users", auth, role("admin"), getUsers);

module.exports = router;
