import React, { useState, useEffect, useCallback, Suspense } from "react";
import { IonPage, IonContent, IonSpinner } from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import { useStore } from "../../store";

import Sidebar    from "../../components/ui/Sidebar";
import TopBar     from "../../components/ui/TopBar";

/* ── Lazy-load chaque vue ── */
import DashboardView    from "./AdminDashboard";
import AlertesView      from "./AlertesPage";
import MapView          from "./MapPage";
import RapportsView     from "./RapportsPage";
import UsersView        from "./UsersPage";
import StatsView        from "../../components/dashboard/StatCard";


/* ── Mapping page id → composant ── */
const ADMIN_VIEWS: Record<string, React.FC<any>> = {
  dashboard:     DashboardView,
  alertes:       AlertesView,
  map:           MapView,
  rapports:      RapportsView,
  users:         UsersView,
  stats:         StatsView,
};

const CHAUFFEUR_VIEWS: Record<string, React.FC<any>> = {
  alertes:       AlertesView,
  map:           MapView,
  rapports:      RapportsView,
};

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard:     { title: "Dashboard",       subtitle: "Vue d'ensemble EcoAlert" },
  alertes:       { title: "Alertes",         subtitle: "Gestion des signalements" },
  map:           { title: "Carte Interactive",subtitle: "Localisation en temps réel" },
  rapports:      { title: "Rapports",        subtitle: "Rapports d'activité" },
  users:         { title: "Équipe",          subtitle: "Gestion des membres" },
  stats:         { title: "Statistiques",    subtitle: "Analyses et performances" },
};

/* ── Spinner de chargement de vue ── */
const ViewLoader: React.FC = () => (
  <div style={{
    display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center",
    height:"60vh", gap:16,
  }}>
    <IonSpinner name="crescent" style={{ "--color":"#3b7ef8", transform:"scale(1.8)" }}/>
    <p style={{ fontSize:13, color:"#94a3b8", fontFamily:"'DM Sans',sans-serif" }}>Chargement...</p>
  </div>
);

/* ─────────────────────────────── SHELL ─────────────────────────────── */
const DashboardShell: React.FC = () => {
  const history  = useHistory();
  const location = useLocation();
  const { user } = useStore();

  /* Extraire la page active depuis l'URL : /app/alertes → "alertes" */
  const getPageFromPath = useCallback((path: string) => {
    const seg = path.replace("/app/", "").split("/")[0];
    return seg || "dashboard";
  }, []);

  const [activePage,   setActivePage]   = useState(getPageFromPath(location.pathname));
  const [prevPage,     setPrevPage]     = useState("");
  const [animKey,      setAnimKey]      = useState(0);     // force re-render animé
  const [sideCollapsed,setSideCollapsed]= useState(false);
  const [refreshKey,   setRefreshKey]   = useState(0);

  /* Sync URL → activePage */
  useEffect(() => {
    const page = getPageFromPath(location.pathname);
    if (page !== activePage) {
      setPrevPage(activePage);
      setActivePage(page);
      setAnimKey(k => k + 1);
    }
  }, [location.pathname]);

  /* Navigation sidebar → URL */
  const handleNavigate = useCallback((page: string) => {
    if (page === activePage) return;
    setPrevPage(activePage);
    setActivePage(page);
    setAnimKey(k => k + 1);
    history.push(`/app/${page}`);
  }, [activePage, history]);

  /* Refresh de la vue courante */
  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  /* Choisir les vues selon le rôle */
  const views = user?.role === "chauffeur" ? CHAUFFEUR_VIEWS : ADMIN_VIEWS;
  const CurrentView = views[activePage];
  const meta = PAGE_TITLES[activePage] || { title: activePage, subtitle: "" };

  const sideWidth = sideCollapsed ? 68 : 240;

  return (
    <IonPage>
      {/* ── Sidebar ── */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        collapsed={sideCollapsed}
        onToggleCollapse={() => setSideCollapsed(p => !p)}
      />

      {/* ── Main area ── */}
      <div style={{
        marginLeft: sideWidth,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: "100vh",
        transition: "margin-left .3s ease",
        background: "#EEF2FF",
      }}>
        {/* Top bar */}
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          onRefresh={handleRefresh}
          activePage={activePage}
          onNavigate={handleNavigate}
        />

        {/* ── Page content ── */}
        <IonContent
          style={{ "--background": "#EEF2FF" }}
          scrollEvents
        >
          <div
            key={`${activePage}-${animKey}`}
            style={{
              animation: "pageSlideIn .38s cubic-bezier(.22,1,.36,1) both",
              minHeight: "calc(100vh - 64px)",
            }}
          >
            <Suspense fallback={<ViewLoader />}>
              <CurrentView
                key={`view-${activePage}-${refreshKey}`}
                onNavigate={handleNavigate}
                refreshKey={refreshKey}
              />
            </Suspense>
          </div>
        </IonContent>
      </div>

      {/* Animation globale pageSlideIn */}
      <style>{`
        @keyframes pageSlideIn {
          from { opacity:0; transform:translateY(18px) scale(.99); }
          to   { opacity:1; transform:translateY(0)    scale(1); }
        }
      `}</style>
    </IonPage>
  );
};

export default DashboardShell;
