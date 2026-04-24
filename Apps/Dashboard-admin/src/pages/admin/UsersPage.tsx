import React, { useEffect, useState, useCallback } from "react";
import { IonPage, IonContent, IonIcon, IonSpinner } from "@ionic/react";
import { peopleOutline, carOutline, personOutline, trendingUpOutline, callOutline, mailOutline } from "ionicons/icons";
import { usersAPI } from "../../services/api";

const ROLE_COLORS: any = { citoyen:"#8b5cf6", chauffeur:"#3b7ef8" };
const ROLE_BG:    any  = { citoyen:"#F5F3FF", chauffeur:"#EEF2FF" };

const UsersPage: React.FC = () => {
  const [users,      setUsers]      = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [roleFilter, setRoleFilter] = useState("tous");
  const [activePage, setActivePage] = useState("users");

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await usersAPI.getAll(); setUsers(r.data||[]); } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = roleFilter==="tous" ? users : users.filter(u=>u.role===roleFilter);
  const chauffeurs = users.filter(u=>u.role==="chauffeur");
  const citoyens   = users.filter(u=>u.role==="citoyen");

  return (
    <IonPage>
      <div style={{ display:"flex", minHeight:"100vh", background:"#EEF2FF" }}>
        <div style={{ marginLeft:15, flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <IonContent style={{ "--background":"#EEF2FF" }}>
            <div style={{ padding:"24px 28px" }}>

              {/* Summary cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
                {[
                  { label:"Total membres", val:users.length,       icon:peopleOutline,  color:"#3b7ef8", bg:"#EEF2FF" },
                  { label:"Chauffeurs",    val:chauffeurs.length,  icon:carOutline,     color:"#0891b2", bg:"#E0F2FE" },
                  { label:"Citoyens",      val:citoyens.length,    icon:personOutline,  color:"#8b5cf6", bg:"#F5F3FF" },
                ].map((s,i) => (
                  <div key={i} className="card" style={{ padding:"20px 24px", animation:`fadeUp .4s ${i*.08}s ease both`, opacity:0, animationFillMode:"forwards" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:44,height:44,borderRadius:12,background:s.bg,border:`1px solid ${s.color}22`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <IonIcon icon={s.icon} style={{ fontSize:20,color:s.color }}/>
                      </div>
                      <div>
                        <div className="stat-num" style={{ fontSize:28,color:"#1e293b" }}>{s.val}</div>
                        <div style={{ fontSize:12,color:"#94a3b8",marginTop:2 }}>{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filter */}
              <div style={{ display:"flex", gap:8, marginBottom:20 }}>
                {["tous","chauffeur","citoyen"].map(r => (
                  <button key={r} onClick={()=>setRoleFilter(r)} style={{
                    padding:"8px 16px", borderRadius:8, border:"1px solid rgba(59,126,248,.15)",
                    background:roleFilter===r?"#3b7ef8":"#fff",
                    color:roleFilter===r?"#fff":"#64748b",
                    fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .2s",
                    textTransform:"capitalize",
                  }}>{r==="tous"?"Tous":r+"s"}</button>
                ))}
              </div>

              {/* Table */}
              {loading ? (
                <div style={{ display:"flex",justifyContent:"center",padding:60 }}>
                  <IonSpinner name="crescent" style={{ "--color":"#3b7ef8",transform:"scale(1.5)" }}/>
                </div>
              ) : (
                <div className="card" style={{ overflow:"hidden", animation:"fadeUp .4s .2s ease both", opacity:0, animationFillMode:"forwards" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#F8FAFF", borderBottom:"1px solid #f1f5f9" }}>
                        {["Membre","Rôle","Contact","Interventions","Score","Inscrit le"].map(h => (
                          <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:.05, textTransform:"uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u, i) => (
                        <tr key={u.id} style={{
                          borderBottom:"1px solid #f1f5f9", transition:"background .15s",
                          animation:`fadeUp .3s ${i*.04}s ease both`,
                        }}
                          onMouseEnter={e=>(e.currentTarget.style.background="#F8FAFF")}
                          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                        >
                          <td style={{ padding:"14px 16px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div style={{ width:36,height:36,borderRadius:"50%",flexShrink:0,
                                background:`linear-gradient(135deg,${ROLE_COLORS[u.role]||"#94a3b8"},${ROLE_COLORS[u.role]||"#64748b"})`,
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:13,color:"#fff",
                              }}>{u.name?.[0]?.toUpperCase()}</div>
                              <div>
                                <div style={{ fontSize:13,fontWeight:600,color:"#1e293b" }}>{u.name}</div>
                                <div style={{ fontSize:11,color:"#94a3b8" }}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"14px 16px" }}>
                            <span style={{ padding:"3px 10px",borderRadius:50,fontSize:11,fontWeight:700,
                              background:ROLE_BG[u.role]||"#F8FAFF",color:ROLE_COLORS[u.role]||"#64748b" }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding:"14px 16px" }}>
                            <div style={{ fontSize:12,color:"#64748b" }}>
                              {u.phone && <div style={{ display:"flex",alignItems:"center",gap:4 }}><IonIcon icon={callOutline} style={{ fontSize:12 }}/>{u.phone}</div>}
                            </div>
                          </td>
                          <td style={{ padding:"14px 16px" }}>
                            <span style={{ fontSize:13,fontWeight:700,color:"#1e293b" }}>{u.interventions||0}</span>
                          </td>
                          <td style={{ padding:"14px 16px" }}>
                            {u.score > 0 ? (
                              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                                <div className="prog-bar" style={{ width:60 }}>
                                  <div className="prog-fill" style={{ "--w":`${Math.min(100,u.score)}%` } as any}/>
                                </div>
                                <span style={{ fontSize:12,fontWeight:700,color:"#3b7ef8" }}>{Math.round(u.score)}%</span>
                              </div>
                            ) : <span style={{ color:"#94a3b8",fontSize:12 }}>—</span>}
                          </td>
                          <td style={{ padding:"14px 16px",fontSize:12,color:"#94a3b8" }}>
                            {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!filtered.length && (
                    <div style={{ padding:"40px",textAlign:"center",color:"#94a3b8",fontSize:13 }}>Aucun membre</div>
                  )}
                </div>
              )}
            </div>
          </IonContent>
        </div>
      </div>
    </IonPage>
  );
};

export default UsersPage;
