import React, { useEffect, useState } from "react";
import { IonIcon, IonBadge } from "@ionic/react";
import {
  notificationsOutline, searchOutline, refreshOutline,
  moonOutline, sunnyOutline,
} from "ionicons/icons";
import { notifAPI } from "../../services/api";
import { useStore } from "../../store";

interface Props { title: string; subtitle?: string; onRefresh?: () => void; }

const TopBar: React.FC<Props> = ({ title, subtitle, onRefresh }) => {
  const { user, unread, setUnread } = useStore();
  const [showNotif, setShowNotif]   = useState(false);
  const [notifs,    setNotifs]      = useState<any[]>([]);
  const [dark,      setDark]        = useState(false);

  useEffect(() => {
    notifAPI.get().then(r => {
      setNotifs(r.data.notifications || []);
      setUnread(r.data.unread || 0);
    }).catch(() => {});
  }, []);

  const handleRead = async () => {
    setShowNotif(p => !p);
    if (unread > 0) {
      await notifAPI.markRead().catch(() => {});
      setUnread(0);
      setNotifs(p => p.map(n => ({ ...n, isRead: true })));
    }
  };

  return (
    <header style={{
      height: 64,
      background: "#fff",
      borderBottom: "1px solid rgba(59,126,248,0.10)",
      display: "flex", alignItems: "center",
      padding: "0 28px", gap: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,.04)",
      position: "sticky", top: 0, zIndex: 50,
      animation: "fadeIn .4s ease both",
    }}>
      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800, fontSize: 20, color: "#1e293b", lineHeight: 1,
        }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{subtitle}</p>
        )}
      </div>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "#F0F4FF", borderRadius: 10,
        padding: "8px 14px", border: "1px solid rgba(59,126,248,.1)",
      }}>
        <IonIcon icon={searchOutline} style={{ color: "#94a3b8", fontSize: 15 }} />
        <input placeholder="Rechercher..."
          style={{
            border: "none", background: "transparent",
            fontSize: 13, color: "#1e293b", outline: "none",
            width: 160, fontFamily: "'DM Sans',sans-serif",
          }} />
      </div>

      {/* Refresh */}
      {onRefresh && (
        <button onClick={onRefresh} style={{
          width: 38, height: 38, borderRadius: 10,
          background: "#F0F4FF", border: "1px solid rgba(59,126,248,.1)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "#DBEAFE")}
          onMouseLeave={e => (e.currentTarget.style.background = "#F0F4FF")}
        >
          <IonIcon icon={refreshOutline} style={{ color: "#3b7ef8", fontSize: 16 }} />
        </button>
      )}

      {/* Dark mode toggle */}
      <button onClick={() => setDark(p => !p)} style={{
        width: 38, height: 38, borderRadius: 10,
        background: "#F0F4FF", border: "1px solid rgba(59,126,248,.1)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <IonIcon icon={dark ? sunnyOutline : moonOutline} style={{ color: "#64748b", fontSize: 16 }} />
      </button>

      {/* Notifications */}
      <div style={{ position: "relative" }}>
        <button onClick={handleRead} style={{
          width: 38, height: 38, borderRadius: 10,
          background: "#F0F4FF", border: "1px solid rgba(59,126,248,.1)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s", position: "relative",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "#DBEAFE")}
          onMouseLeave={e => (e.currentTarget.style.background = "#F0F4FF")}
        >
          <IonIcon icon={notificationsOutline} style={{ color: "#3b7ef8", fontSize: 18 }} />
          {unread > 0 && (
            <div style={{
              position: "absolute", top: -4, right: -4,
              width: 18, height: 18, borderRadius: "50%",
              background: "#ef4444", color: "#fff",
              fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #fff",
              animation: "pulseGlow .8s ease-in-out infinite",
            }}>{unread > 9 ? "9+" : unread}</div>
          )}
        </button>

        {/* Dropdown */}
        {showNotif && (
          <div style={{
            position: "absolute", right: 0, top: 46,
            width: 320, background: "#fff",
            borderRadius: 14, boxShadow: "0 16px 48px rgba(0,0,0,.15)",
            border: "1px solid rgba(59,126,248,.12)",
            zIndex: 200, overflow: "hidden",
            animation: "scaleIn .25s ease both",
          }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontWeight: 700, fontSize: 14, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Notifications</span>
              <span style={{ fontSize: 11, color: "#3b7ef8", cursor: "pointer", fontWeight:600 }}>Tout marquer lu</span>
            </div>
            <div style={{ maxHeight: 340, overflowY: "auto" }}>
              {notifs.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                  Aucune notification
                </div>
              ) : notifs.map((n, i) => (
                <div key={n.id} style={{
                  padding: "12px 18px",
                  background: n.isRead ? "#fff" : "#F0F4FF",
                  borderBottom: "1px solid #f1f5f9",
                  animation: `fadeUp .3s ${i*.05}s ease both`,
                  cursor: "pointer",
                  transition: "background .2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.background = n.isRead ? "#fff" : "#F0F4FF")}
                >
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{
                      width:8, height:8, borderRadius:"50%", marginTop:5, flexShrink:0,
                      background: n.priority==="urgente"?"#ef4444":n.priority==="normale"?"#3b7ef8":"#94a3b8",
                    }}/>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{n.titre}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{n.message}</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
                        {new Date(n.createdAt).toLocaleString("fr-FR")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "linear-gradient(135deg,#3b7ef8,#1d4ed8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 14, color: "#fff",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(59,126,248,.35)",
      }}>
        {user?.name?.[0]?.toUpperCase()}
      </div>
    </header>
  );
};

export default TopBar;
