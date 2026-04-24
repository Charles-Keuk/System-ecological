import React from "react";
import { IonIcon } from "@ionic/react";
import {
  gridOutline, alertCircleOutline, carOutline, documentTextOutline,
  mapOutline, peopleOutline, statsChartOutline, leafOutline,
  logOutOutline, settingsOutline, chevronBackOutline, chevronForwardOutline,
} from "ionicons/icons";
import { useStore } from "../../store";
import { authAPI } from "../../services/api";

/* ── Menus par rôle ── */
const ADMIN_MENU = [
  { label:"Dashboard",     icon:gridOutline,        path:"dashboard", color:"#3b7ef8" },
  { label:"Alertes",       icon:alertCircleOutline, path:"alertes",   color:"#ef4444" },
  { label:"Carte",         icon:mapOutline,         path:"map",       color:"#10b981" },
  { label:"Rapports",      icon:documentTextOutline,path:"rapports",  color:"#8b5cf6" },
  { label:"Équipe",        icon:peopleOutline,      path:"users",     color:"#0891b2" },
  { label:"Statistiques",  icon:statsChartOutline,  path:"stats",     color:"#059669" },
];
const CHAUFFEUR_MENU = [
  { label:"Tableau de bord",icon:gridOutline,       path:"dashboard", color:"#3b7ef8" },
  { label:"Mes Alertes",   icon:alertCircleOutline, path:"alertes",   color:"#ef4444" },
  { label:"Carte",         icon:mapOutline,         path:"map",       color:"#10b981" },
  { label:"Interventions", icon:carOutline,         path:"interventions",color:"#f59e0b" },
  { label:"Rapports",      icon:documentTextOutline,path:"rapports",  color:"#8b5cf6" },
];
const CITOYEN_MENU = [
  { label:"Mes Signalements",icon:alertCircleOutline,path:"alertes",  color:"#ef4444" },
  { label:"Carte",           icon:mapOutline,        path:"map",      color:"#10b981" },
];

const ROLE_LABEL: Record<string,string> = {
  admin:"Administrateur", chauffeur:"Chauffeur", citoyen:"Citoyen",
};

interface Props {
  activePage:        string;
  onNavigate:        (p:string) => void;
  collapsed:         boolean;
  onToggleCollapse:  () => void;
}

const Sidebar: React.FC<Props> = ({
  activePage, onNavigate, collapsed, onToggleCollapse,
}) => {
  const { user, logout } = useStore();

  const menu = user?.role === "admin"     ? ADMIN_MENU
             : user?.role === "chauffeur" ? CHAUFFEUR_MENU
             : CITOYEN_MENU;

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch {}
    logout();
    window.location.href = "/login";
  };

  const W = collapsed ? 68 : 240;

  return (
    <>
      {/* ── Styles inline injectés une fois ── */}
      <style>{`
        .sb-item {
          display:flex; align-items:center; gap:12px;
          padding:10px 14px; margin:2px 8px;
          border-radius:10px; cursor:pointer;
          font-size:13.5px; font-weight:500;
          color:#64748b;
          font-family:'DM Sans',sans-serif;
          position:relative; overflow:hidden;
          transition:background .2s, color .2s, transform .15s;
          white-space:nowrap;
          user-select:none;
        }
        .sb-item::before {
          content:'';
          position:absolute; left:0; top:20%; bottom:20%;
          width:3px; border-radius:0 3px 3px 0;
          background:transparent;
          transition:background .2s;
        }
        .sb-item:hover {
          background:#F0F4FF;
          color:#1e293b;
          transform:translateX(2px);
        }
        .sb-item.active {
          background:linear-gradient(135deg,#EEF2FF,#DBEAFE);
          color:#1d4ed8;
          font-weight:700;
          box-shadow:0 2px 12px rgba(59,126,248,.14);
        }
        .sb-item.active::before { background:#3b7ef8; }

        .sb-item .sb-icon-wrap {
          width:32px; height:32px; border-radius:8px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          transition:background .2s, box-shadow .2s;
        }
        .sb-item.active .sb-icon-wrap {
          background:rgba(59,126,248,.15);
          box-shadow:0 0 0 1px rgba(59,126,248,.2);
        }
        .sb-item:hover:not(.active) .sb-icon-wrap {
          background:rgba(59,126,248,.07);
        }

        .sb-tooltip {
          position:fixed; left:76px;
          background:#1e293b; color:#fff;
          font-size:12px; font-weight:600;
          padding:5px 10px; border-radius:7px;
          pointer-events:none; z-index:9999;
          white-space:nowrap; opacity:0;
          transform:translateX(-4px);
          transition:opacity .15s, transform .15s;
          box-shadow:0 4px 12px rgba(0,0,0,.2);
        }
        .sb-item:hover .sb-tooltip { opacity:1; transform:translateX(0); }

        @keyframes sideSlide {
          from{opacity:0;transform:translateX(-14px)}
          to  {opacity:1;transform:translateX(0)}
        }
        @keyframes sbItemIn {
          from{opacity:0;transform:translateX(-10px)}
          to  {opacity:1;transform:translateX(0)}
        }
      `}</style>

      <aside style={{
        width: W,
        minHeight: "100vh",
        position: "fixed", left:0, top:0, zIndex:200,
        background: "#ffffff",
        borderRight: "1px solid rgba(59,126,248,0.10)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column",
        transition: "width .3s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
      }}>

        {/* ── Logo ── */}
        <div style={{
          padding: "18px 14px 14px",
          display:"flex", alignItems:"center", gap:10,
          borderBottom:"1px solid rgba(59,126,248,0.08)",
          minHeight:68,
        }}>
          {/* Logo icon */}
          <div style={{
            width:38, height:38, borderRadius:11, flexShrink:0,
            background:"linear-gradient(135deg,#3b7ef8,#1d4ed8)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 4px 14px rgba(59,126,248,0.38)",
            animation:"pulseGlow 3s ease-in-out infinite",
            cursor:"pointer",
          }} onClick={() => onNavigate("dashboard")}>
            <IonIcon icon={leafOutline} style={{ color:"#fff", fontSize:20 }}/>
          </div>

          {/* Brand text */}
          {!collapsed && (
            <div style={{ animation:"sideSlide .28s ease both", minWidth:0, flex:1 }}>
              <div style={{
                fontFamily:"'Plus Jakarta Sans',sans-serif",
                fontWeight:800, fontSize:17, color:"#1e293b", lineHeight:1.1,
              }}>EcoAlert</div>
              <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:1.2, textTransform:"uppercase", marginTop:1 }}>
                {ROLE_LABEL[user?.role||""] || user?.role}
              </div>
            </div>
          )}

          {/* Toggle button */}
          <button onClick={onToggleCollapse} style={{
            marginLeft:"auto", flexShrink:0,
            width:28, height:28, borderRadius:8,
            background:"#F0F4FF", border:"1px solid rgba(59,126,248,.15)",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all .2s", color:"#64748b",
          }}
            onMouseEnter={e=>(e.currentTarget.style.background="#DBEAFE")}
            onMouseLeave={e=>(e.currentTarget.style.background="#F0F4FF")}
          >
            <IonIcon
              icon={collapsed ? chevronForwardOutline : chevronBackOutline}
              style={{ fontSize:14 }}
            />
          </button>
        </div>

        {/* ── User card ── */}
        {!collapsed && (
          <div style={{ padding:"12px 14px 4px", animation:"sideSlide .3s .05s ease both" }}>
            <div style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px",
              background:"linear-gradient(135deg,#F0F4FF,#EEF2FF)",
              borderRadius:12, border:"1px solid rgba(59,126,248,.1)",
            }}>
              <div style={{
                width:34, height:34, borderRadius:"50%", flexShrink:0,
                background:"linear-gradient(135deg,#3b7ef8,#10b981)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Plus Jakarta Sans',sans-serif",
                fontWeight:800, fontSize:13, color:"#fff",
                boxShadow:"0 2px 8px rgba(59,126,248,.3)",
              }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{
                  fontSize:13, fontWeight:700, color:"#1e293b",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                }}>{user?.name}</div>
                <div style={{
                  fontSize:11, color:"#94a3b8",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                }}>{user?.email}</div>
              </div>
              {/* Online dot */}
              <div style={{
                width:8, height:8, borderRadius:"50%",
                background:"#10b981", flexShrink:0,
                boxShadow:"0 0 0 2px #fff, 0 0 8px rgba(16,185,129,.6)",
              }}/>
            </div>
          </div>
        )}

        {/* Collapsed mini avatar */}
        {collapsed && (
          <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}>
            <div style={{
              width:34, height:34, borderRadius:"50%",
              background:"linear-gradient(135deg,#3b7ef8,#10b981)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              fontWeight:800, fontSize:13, color:"#fff",
              boxShadow:"0 2px 8px rgba(59,126,248,.3)",
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        )}

        {/* ── Section label ── */}
        {!collapsed && (
          <div style={{ padding:"14px 22px 6px", animation:"sideSlide .3s ease both" }}>
            <span style={{ fontSize:10, fontWeight:700, color:"#c8d6e5", letterSpacing:1.5, textTransform:"uppercase" }}>
              Navigation
            </span>
          </div>
        )}

        {/* ── Nav items ── */}
        <nav style={{ flex:1, padding:"4px 0", overflowY:"auto", overflowX:"hidden" }}>
          {menu.map((item, i) => (
            <div
              key={item.path}
              className={`sb-item ${activePage === item.path ? "active" : ""}`}
              onClick={() => onNavigate(item.path)}
              style={{
                animation:`sbItemIn .35s ${i*0.045}s ease both`,
                padding: collapsed ? "10px" : "10px 14px",
                justifyContent: collapsed ? "center" : "flex-start",
                margin: collapsed ? "2px 10px" : "2px 8px",
              }}
            >
              {/* Icon wrapper */}
              <div className="sb-icon-wrap">
                <IonIcon
                  icon={item.icon}
                  style={{
                    fontSize:18, flexShrink:0,
                    color: activePage === item.path ? item.color : "currentColor",
                    transition:"color .2s",
                  }}
                />
              </div>

              {/* Label (masqué si collapsed) */}
              {!collapsed && (
                <span style={{ animation:"sideSlide .25s ease both" }}>
                  {item.label}
                </span>
              )}

              {/* Tooltip sur hover en mode collapsed */}
              {collapsed && (
                <span className="sb-tooltip">{item.label}</span>
              )}

              {/* Badge exemple alertes non lues */}
              {item.path === "alertes" && !collapsed && (
                <span style={{
                  marginLeft:"auto", minWidth:20, height:20,
                  borderRadius:10,
                  background: activePage==="alertes" ? "#3b7ef8" : "#FEE2E2",
                  color:      activePage==="alertes" ? "#fff"    : "#ef4444",
                  fontSize:10, fontWeight:800,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  padding:"0 5px",
                  animation:"pulse 2s ease-in-out infinite",
                }}>!</span>
              )}
            </div>
          ))}
        </nav>

        {/* ── Divider ── */}
        <div style={{ margin:"4px 14px", height:1, background:"rgba(59,126,248,0.08)" }}/>

        {/* ── Footer actions ── */}
        <div style={{ padding:"6px 0 12px" }}>
          {/* Settings */}
          <div className="sb-item" style={{
            padding: collapsed?"10px":"10px 14px",
            justifyContent: collapsed?"center":"flex-start",
            margin: collapsed?"2px 10px":"2px 8px",
          }}>
            <div className="sb-icon-wrap">
              <IonIcon icon={settingsOutline} style={{ fontSize:18, color:"#64748b" }}/>
            </div>
            {!collapsed && <span style={{ animation:"sideSlide .25s ease both" }}>Paramètres</span>}
            {collapsed && <span className="sb-tooltip">Paramètres</span>}
          </div>

          {/* Logout */}
          <div className="sb-item" onClick={handleLogout} style={{
            color:"#ef4444",
            padding: collapsed?"10px":"10px 14px",
            justifyContent: collapsed?"center":"flex-start",
            margin: collapsed?"2px 10px":"2px 8px",
          }}>
            <div className="sb-icon-wrap" style={{ background:"rgba(239,68,68,.08)" }}>
              <IonIcon icon={logOutOutline} style={{ fontSize:18, color:"#ef4444" }}/>
            </div>
            {!collapsed && <span style={{ animation:"sideSlide .25s ease both", color:"#ef4444" }}>Déconnexion</span>}
            {collapsed && <span className="sb-tooltip">Déconnexion</span>}
          </div>
        </div>

        {/* ── Version ── */}
        {!collapsed && (
          <div style={{ padding:"0 22px 14px", animation:"sideSlide .3s ease both" }}>
            <div style={{ fontSize:10, color:"#c8d6e5", letterSpacing:.5 }}>EcoAlert v2.0 · 2026</div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
