import React, { useEffect, useState, useCallback } from "react";
import { IonIcon, IonSpinner } from "@ionic/react";
import {
  alertCircleOutline, carOutline, peopleOutline, checkmarkCircleOutline,
  timeOutline, trendingUpOutline, warningOutline, documentTextOutline,
  arrowForwardOutline,
} from "ionicons/icons";
import StatCard from "../../components/dashboard/StatCard";
import { AlertesAreaChart, ZoneBarChart, PrioriteDonut, PerformanceLine }
  from "../../components/charts/Charts";
import { dashAPI } from "../../services/api";

interface Props { onNavigate: (p:string) => void; refreshKey?: number; }

const Badge: React.FC<{ val:string; type:string }> = ({ val, type }) => (
  <span className={`badge badge-${type}`}>{val}</span>
);

const Ring: React.FC<{ pct:number; color?:string; label:string }> = ({
  pct, color="#3b7ef8", label,
}) => (
  <div style={{ textAlign:"center" }}>
    <svg width={80} height={80} viewBox="0 0 80 80">
      <circle className="ring-track" cx={40} cy={40} r={35}/>
      <circle className="ring-fill" cx={40} cy={40} r={35}
        style={{ "--pct":pct, stroke:color } as never}/>
      <text x={40} y={45} textAnchor="middle"
        style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:14, fill:"#1e293b" }}>
        {pct}%
      </text>
    </svg>
    <div style={{ fontSize:11, color:"#64748b", marginTop:4 }}>{label}</div>
  </div>
);

const DashboardView: React.FC<Props> = ({ onNavigate, refreshKey }) => {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await dashAPI.admin();
      setData(r.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load, refreshKey]);

  /* auto-refresh 30s */
  useEffect(() => {
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  const t = data?.totals || {};
  const traiteRate = Math.min(100, Math.round((t.traites||0)/Math.max(1,t.totalAlertes||1)*100));

  if (loading && !data) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"60vh" }}>
      <IonSpinner name="crescent" style={{ "--color":"#3b7ef8", transform:"scale(1.8)" }}/>
    </div>
  );

  return (
    <div style={{ padding:"24px 28px 40px" }}>

      {/* ══ ROW 1 : Stats ══ */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:18 }}>
        <StatCard label="Total Alertes"  value={t.totalAlertes||0}      icon={alertCircleOutline}     color="#3b7ef8" bg="#EEF2FF" delay={0}    trend={12}/>
        <StatCard label="En Attente"     value={t.enAttente||0}         icon={timeOutline}            color="#f59e0b" bg="#FEF3C7" delay={0.06}  trend={-5}/>
        <StatCard label="En Cours"       value={t.enCours||0}           icon={carOutline}             color="#6366f1" bg="#F5F3FF" delay={0.12}/>
        <StatCard label="Traitées"       value={t.traites||0}           icon={checkmarkCircleOutline} color="#10b981" bg="#D1FAE5" delay={0.18}  trend={8}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <StatCard label="Aujourd'hui"    value={t.alertesAujourdhui||0} icon={warningOutline}         color="#ef4444" bg="#FEE2E2" delay={0.24}/>
        <StatCard label="Citoyens"       value={t.totalCitoyens||0}     icon={peopleOutline}          color="#8b5cf6" bg="#F5F3FF" delay={0.30}/>
        <StatCard label="Chauffeurs"     value={t.totalChauffeurs||0}   icon={carOutline}             color="#0891b2" bg="#E0F2FE" delay={0.36}/>
        <StatCard label="Rapports/jour"  value={t.rapportsAujourdhui||0}icon={documentTextOutline}    color="#059669" bg="#D1FAE5" delay={0.42}/>
      </div>

      {/* ══ ROW 2 : Charts ══ */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:16 }}>
        {/* Area chart */}
        <div className="card" style={{ padding:"22px 24px", animation:"fadeUp .5s .28s ease both", opacity:0, animationFillMode:"forwards" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div>
              <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:"#1e293b" }}>
                Évolution des Alertes
              </h3>
              <p style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>7 derniers jours</p>
            </div>
            <button style={{
              background:"#F0F4FF", border:"1px solid rgba(59,126,248,.15)",
              borderRadius:8, padding:"5px 12px",
              fontSize:12, color:"#3b7ef8", cursor:"pointer", fontWeight:600,
            }}>Exporter</button>
          </div>
          <AlertesAreaChart data={data?.evolution7j || []}/>
        </div>

        {/* Donut */}
        <div className="card" style={{ padding:"22px 24px", animation:"fadeUp .5s .36s ease both", opacity:0, animationFillMode:"forwards" }}>
          <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:"#1e293b", marginBottom:4 }}>
            Par Priorité
          </h3>
          <p style={{ fontSize:12, color:"#94a3b8", marginBottom:14 }}>Répartition des alertes</p>
          <PrioriteDonut data={data?.parPriorite || []}/>
          <div style={{ display:"flex", flexDirection:"column", gap:7, marginTop:14 }}>
            {[
              { p:"elevee", c:"#ef4444", l:"Élevée" },
              { p:"moyenne",c:"#f59e0b", l:"Moyenne" },
              { p:"faible", c:"#10b981", l:"Faible" },
            ].map(x => {
              const found = (data?.parPriorite||[]).find((d:any)=>d.priorite===x.p);
              return (
                <div key={x.p} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:9,height:9,borderRadius:"50%",background:x.c }}/>
                    <span style={{ fontSize:12, color:"#64748b" }}>{x.l}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>{found?.count||0}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ ROW 3 : Zones + Performance ══ */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Zone bars */}
        <div className="card" style={{ padding:"22px 24px", animation:"fadeUp .5s .44s ease both", opacity:0, animationFillMode:"forwards" }}>
          <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:"#1e293b", marginBottom:2 }}>
            Alertes par Zone
          </h3>
          <p style={{ fontSize:12, color:"#94a3b8", marginBottom:14 }}>Top 8 zones actives</p>
          <ZoneBarChart data={data?.parZone || []}/>
        </div>

        {/* Performance + rings */}
        <div className="card" style={{ padding:"22px 24px", animation:"fadeUp .5s .51s ease both", opacity:0, animationFillMode:"forwards" }}>
          <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:"#1e293b", marginBottom:2 }}>
            Performance
          </h3>
          <p style={{ fontSize:12, color:"#94a3b8", marginBottom:14 }}>30 derniers jours</p>
          <PerformanceLine data={(data?.statsJours||[]).slice().reverse()}/>
          <div style={{ display:"flex", justifyContent:"space-around", marginTop:18 }}>
            <Ring pct={traiteRate} label="Traitement"/>
            <Ring pct={Math.min(100,(t.interventionsActives||0)*10)||42} color="#10b981" label="Actives"/>
            <Ring pct={72} color="#f59e0b" label="Satisfaction"/>
          </div>
        </div>
      </div>

      {/* ══ ROW 4 : Top chauffeurs + Alertes récentes ══ */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:16 }}>
        {/* Top chauffeurs */}
        <div className="card" style={{ padding:"22px 24px", animation:"fadeUp .5s .58s ease both", opacity:0, animationFillMode:"forwards" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:"#1e293b" }}>
              Top Chauffeurs
            </h3>
            <IonIcon icon={trendingUpOutline} style={{ color:"#3b7ef8", fontSize:18 }}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {(data?.topChauffeurs||[]).map((c:any, i:number) => (
              <div key={c.id} style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"10px 12px", borderRadius:10,
                background: i===0 ? "linear-gradient(135deg,#EEF2FF,#DBEAFE)" : "#F8FAFF",
                border:"1px solid rgba(59,126,248,.08)",
                animation:`fadeUp .4s ${i*.07}s ease both`,
                transition:"transform .2s",
              }}
                onMouseEnter={e=>(e.currentTarget.style.transform="translateX(3px)")}
                onMouseLeave={e=>(e.currentTarget.style.transform="translateX(0)")}
              >
                <div style={{
                  width:32,height:32,borderRadius:"50%",flexShrink:0,
                  background:`linear-gradient(135deg,${["#3b7ef8","#10b981","#f59e0b","#ef4444","#8b5cf6"][i]},${["#1d4ed8","#059669","#d97706","#dc2626","#7c3aed"][i]})`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:12,color:"#fff",
                }}>{i+1}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:"#1e293b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize:11,color:"#94a3b8" }}>{c.interventions} interventions</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:13,fontWeight:700,color:"#3b7ef8" }}>{Math.round(c.score)}%</div>
                  <div style={{ fontSize:10,color:"#94a3b8" }}>score</div>
                </div>
              </div>
            ))}
            {!data?.topChauffeurs?.length && (
              <div style={{ padding:"20px",textAlign:"center",color:"#94a3b8",fontSize:13 }}>Aucun chauffeur</div>
            )}
          </div>
        </div>

        {/* Alertes récentes */}
        <div className="card" style={{ padding:"22px 24px", animation:"fadeUp .5s .65s ease both", opacity:0, animationFillMode:"forwards" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:"#1e293b" }}>
              Alertes Récentes
            </h3>
            <button onClick={() => onNavigate("alertes")} style={{
              background:"transparent",border:"none",cursor:"pointer",
              color:"#3b7ef8",fontSize:12,fontWeight:600,
              display:"flex",alignItems:"center",gap:4,fontFamily:"'DM Sans',sans-serif",
            }}>
              Voir tout <IonIcon icon={arrowForwardOutline} style={{ fontSize:12 }}/>
            </button>
          </div>
          <div style={{ display:"flex", flexDirection:"column" }}>
            {(data?.recentAlerts||[]).map((a:any, i:number) => (
              <div key={a.id} style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"10px 0",
                borderBottom: i < (data.recentAlerts.length-1) ? "1px solid #f8f9fc" : "none",
                animation:`fadeUp .35s ${i*.055}s ease both`,
                cursor:"pointer", transition:"background .15s", borderRadius:6,
              }}
                onMouseEnter={e=>(e.currentTarget.style.background="#F8FAFF")}
                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
              >
                <div style={{
                  width:9,height:9,borderRadius:"50%",flexShrink:0,
                  background: a.priorite==="elevee"?"#ef4444":a.priorite==="moyenne"?"#f59e0b":"#10b981",
                  boxShadow:`0 0 6px ${a.priorite==="elevee"?"rgba(239,68,68,.5)":a.priorite==="moyenne"?"rgba(245,158,11,.5)":"rgba(16,185,129,.5)"}`,
                }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13,fontWeight:500,color:"#1e293b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                    {a.description || "Signalement citoyen"}
                  </div>
                  <div style={{ fontSize:11,color:"#94a3b8",marginTop:1 }}>
                    {a.citoyenName} · {a.zoneName||"Zone inconnue"} · {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <Badge val={a.statut} type={a.statut}/>
              </div>
            ))}
            {!data?.recentAlerts?.length && (
              <div style={{ padding:"24px",textAlign:"center",color:"#94a3b8",fontSize:13 }}>Aucune alerte</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
