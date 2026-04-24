import React, { useEffect, useState, useCallback } from "react";
import { IonPage, IonContent, IonIcon, IonSpinner } from "@ionic/react";
import {
  documentTextOutline, addOutline, checkmarkCircleOutline,
  eyeOutline, timeOutline, personOutline, calendarOutline,
} from "ionicons/icons";
import Sidebar from "../../components/ui/Sidebar";
import TopBar  from "../../components/ui/TopBar";
import { rapportsAPI } from "../../services/api";
import { useStore } from "../../store";

const STAT_COLORS: any = { envoye:"#3b7ef8", lu:"#f59e0b", valide:"#10b981" };
const STAT_LABELS: any = { envoye:"Envoyé", lu:"Lu", valide:"Validé" };

const RapportsPage: React.FC = () => {
  const { user } = useStore();
  const [rapports,   setRapports]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [selected,   setSelected]   = useState<any>(null);
  const [activePage, setActivePage] = useState("rapports");

  const [form, setForm] = useState({
    dateRapport: new Date().toISOString().split("T")[0],
    resume: "", totalCollecte: "", observations: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await rapportsAPI.getAll();
      setRapports(r.data || []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async () => {
    if (!form.resume) return alert("Résumé requis");
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => v && fd.append(k,v));
      await rapportsAPI.create(fd);
      setShowForm(false);
      setForm({ dateRapport:new Date().toISOString().split("T")[0], resume:"", totalCollecte:"", observations:"" });
      load();
    } catch (e:any) { alert(e.response?.data?.message||"Erreur"); }
    finally { setSubmitting(false); }
  };

  const handleValider = async (id:number, statut:string) => {
    await rapportsAPI.valider(id, statut).catch(()=>{});
    setRapports(p => p.map(r => r.id===id ? {...r, status:statut} : r));
  };

  return (
    <IonPage>
      <div style={{ display:"flex", minHeight:"100vh", background:"#EEF2FF" }}>

        <div style={{ marginLeft:15, flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

          <IonContent style={{ "--background":"#EEF2FF" }}>
            <div style={{ padding:"24px 28px" }}>

              {/* Header actions */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <div style={{ display:"flex", gap:8 }}>
                  {["tous","envoye","lu","valide"].map(s => (
                    <button key={s} style={{
                      padding:"7px 14px", borderRadius:8,
                      background:s==="tous"?"#3b7ef8":"#fff",
                      color:s==="tous"?"#fff":"#64748b",
                      border:"1px solid rgba(59,126,248,.15)",
                      fontSize:12, fontWeight:600, cursor:"pointer",
                    }}>{s==="tous"?"Tous":STAT_LABELS[s]}</button>
                  ))}
                </div>
                {user?.role === "chauffeur" && (
                  <button className="btn-primary" onClick={()=>setShowForm(true)}
                    style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <IonIcon icon={addOutline} style={{ fontSize:16 }}/> Nouveau Rapport
                  </button>
                )}
              </div>

              {loading ? (
                <div style={{ display:"flex", justifyContent:"center", padding:60 }}>
                  <IonSpinner name="crescent" style={{ "--color":"#3b7ef8", transform:"scale(1.5)" }}/>
                </div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
                  {rapports.map((r, i) => (
                    <div key={r.id} className="card" style={{
                      padding:"20px 22px", cursor:"pointer",
                      animation:`fadeUp .4s ${i*.05}s ease both`, opacity:0, animationFillMode:"forwards",
                      borderTop:`3px solid ${STAT_COLORS[r.status]||"#3b7ef8"}`,
                      transition:"all .25s",
                    }}
                      onClick={()=>setSelected(r)}
                      onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
                      onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}
                    >
                      {/* Status badge */}
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:36, height:36, borderRadius:10,
                            background:`${STAT_COLORS[r.status]}18`,
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <IonIcon icon={documentTextOutline} style={{ fontSize:18, color:STAT_COLORS[r.status]||"#3b7ef8" }}/>
                          </div>
                          <div>
                            <div style={{ fontSize:14, fontWeight:600, color:"#1e293b" }}>Rapport #{r.id}</div>
                            <div style={{ fontSize:11, color:"#94a3b8" }}>{new Date(r.dateRapport||r.createdAt).toLocaleDateString("fr-FR")}</div>
                          </div>
                        </div>
                        <span style={{
                          padding:"3px 10px", borderRadius:50, fontSize:11, fontWeight:700,
                          background:`${STAT_COLORS[r.status]}18`, color:STAT_COLORS[r.status]||"#3b7ef8",
                        }}>{STAT_LABELS[r.status]||r.status}</span>
                      </div>

                      <p style={{ fontSize:13, color:"#64748b", lineHeight:1.6, marginBottom:12,
                        overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box",
                        WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                        {r.resume}
                      </p>

                      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94a3b8" }}>
                          <IonIcon icon={personOutline} style={{ fontSize:13 }}/> {r.chauffeurName}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94a3b8" }}>
                          <IonIcon icon={calendarOutline} style={{ fontSize:13 }}/> {new Date(r.createdAt).toLocaleString("fr-FR")}
                        </div>
                        {r.totalCollecte && (
                          <div style={{ fontSize:12, fontWeight:600, color:"#10b981" }}>
                            ✓ {r.totalCollecte} collectes
                          </div>
                        )}
                      </div>

                      {/* Admin actions */}
                      {user?.role==="admin" && r.status==="envoye" && (
                        <div style={{ display:"flex", gap:8, marginTop:14 }} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>handleValider(r.id,"lu")} style={{
                            flex:1, padding:"7px", borderRadius:8,
                            background:"#EEF2FF", border:"1px solid rgba(59,126,248,.2)",
                            color:"#3b7ef8", fontSize:11, fontWeight:600, cursor:"pointer",
                          }}>Marquer lu</button>
                          <button onClick={()=>handleValider(r.id,"valide")} style={{
                            flex:1, padding:"7px", borderRadius:8,
                            background:"#D1FAE5", border:"1px solid rgba(16,185,129,.2)",
                            color:"#059669", fontSize:11, fontWeight:600, cursor:"pointer",
                            display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                          }}>
                            <IonIcon icon={checkmarkCircleOutline} style={{ fontSize:13 }}/> Valider
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {!rapports.length && !loading && (
                    <div style={{ gridColumn:"1/-1", textAlign:"center", padding:60, color:"#94a3b8" }}>
                      <IonIcon icon={documentTextOutline} style={{ fontSize:48, marginBottom:12, display:"block" }}/>
                      <p>Aucun rapport</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </IonContent>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div onClick={()=>setSelected(null)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.35)", zIndex:300,
          display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn .2s ease",
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:"#fff", borderRadius:20, padding:32, width:500, maxHeight:"80vh", overflowY:"auto",
            boxShadow:"0 24px 64px rgba(0,0,0,.18)", animation:"scaleIn .3s ease both",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:18 }}>Rapport #{selected.id}</h2>
              <button onClick={()=>setSelected(null)} style={{ background:"#F1F5F9", border:"none", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:18 }}>×</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16, fontSize:14, color:"#1e293b" }}>
              <div><strong>Chauffeur :</strong> {selected.chauffeurName}</div>
              <div><strong>Date :</strong> {new Date(selected.dateRapport||selected.createdAt).toLocaleDateString("fr-FR")}</div>
              <div><strong>Statut :</strong> <span style={{ color:STAT_COLORS[selected.status], fontWeight:700 }}>{STAT_LABELS[selected.status]}</span></div>
              <div><strong>Résumé :</strong><p style={{ marginTop:6, color:"#64748b", lineHeight:1.7 }}>{selected.resume}</p></div>
              {selected.observations && <div><strong>Observations :</strong><p style={{ marginTop:6, color:"#64748b", lineHeight:1.7 }}>{selected.observations}</p></div>}
              {selected.totalCollecte && <div><strong>Collectes :</strong> {selected.totalCollecte}</div>}
              {selected.pdfUrl && (
                <a href={`http://localhost:3000${selected.pdfUrl}`} target="_blank" rel="noreferrer"
                  style={{ color:"#3b7ef8", fontWeight:600, fontSize:13 }}>📄 Voir le PDF</a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div onClick={()=>setShowForm(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.35)", zIndex:300,
          display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn .2s ease",
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:"#fff", borderRadius:20, padding:32, width:500,
            boxShadow:"0 24px 64px rgba(0,0,0,.18)", animation:"scaleIn .3s ease both",
          }}>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:18, marginBottom:20 }}>Nouveau Rapport</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>Date du rapport</label>
                <input type="date" value={form.dateRapport} onChange={e=>setForm(p=>({...p,dateRapport:e.target.value}))} className="inp-field"/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>Résumé *</label>
                <textarea value={form.resume} onChange={e=>setForm(p=>({...p,resume:e.target.value}))}
                  rows={4} className="inp-field" style={{ resize:"vertical" }} placeholder="Décrivez les activités du jour..."/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>Nombre de collectes</label>
                <input type="number" value={form.totalCollecte} onChange={e=>setForm(p=>({...p,totalCollecte:e.target.value}))} className="inp-field" placeholder="12"/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>Observations</label>
                <textarea value={form.observations} onChange={e=>setForm(p=>({...p,observations:e.target.value}))}
                  rows={3} className="inp-field" style={{ resize:"vertical" }} placeholder="Problèmes rencontrés, remarques..."/>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:24 }}>
              <button onClick={()=>setShowForm(false)} style={{ flex:1, padding:"11px 0", borderRadius:10, border:"1px solid #e2e8f0", background:"#F8FAFF", fontSize:14, fontWeight:600, color:"#64748b", cursor:"pointer" }}>Annuler</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary" style={{ flex:1, padding:"11px 0" }}>
                {submitting ? "Envoi..." : "Soumettre"}
              </button>
            </div>
          </div>
        </div>
      )}
    </IonPage>
  );
};

export default RapportsPage;
