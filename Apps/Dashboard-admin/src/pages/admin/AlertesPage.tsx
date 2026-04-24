import React, { useEffect, useState, useCallback } from "react";
import { IonPage, IonContent, IonIcon, IonSpinner } from "@ionic/react";
import {
  alertCircleOutline, filterOutline, addOutline, searchOutline,
  locationOutline, timeOutline, checkmarkOutline, eyeOutline,
  personOutline, trashOutline, refreshOutline,
} from "ionicons/icons";
import { alertesAPI, interventionsAPI, zonesAPI } from "../../services/api";
import { useStore } from "../../store";

const STATUTS   = ["tous","enAttente","enCours","traite"];
const PRIORITES = ["toutes","faible","moyenne","elevee"];
const PRIO_COLOR: any = { elevee:"#ef4444", moyenne:"#f59e0b", faible:"#10b981" };
const STAT_LABEL: any = { enAttente:"En Attente", enCours:"En Cours", traite:"Traitée", tous:"Tous" };

interface Alerte {
  id:number; description:string; statut:string; priorite:string;
  citoyenName:string; zoneName:string; createdAt:string;
  latitude?:number; longitude?:number; imageUrl?:string;
}

const AlertesPage: React.FC = () => {
  const { user } = useStore();
  const [alertes,  setAlertes]  = useState<Alerte[]>([]);
  const [zones,    setZones]    = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [statut,   setStatut]   = useState("tous");
  const [priorite, setPriorite] = useState("toutes");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<Alerte | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activePage, setActivePage] = useState("alertes");

  /* ── Nouveau signalement ── */
  const [form, setForm] = useState({ description:"", priorite:"moyenne", latitude:"", longitude:"", zoneId:"" });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statut   !== "tous"    ) params.statut   = statut;
      if (priorite !== "toutes"  ) params.priorite = priorite;
      const [aR, zR] = await Promise.all([alertesAPI.getAll(params), zonesAPI.getAll()]);
      setAlertes(aR.data.data || []);
      setZones(zR.data || []);
    } catch {}
    finally { setLoading(false); }
  }, [statut, priorite]);

  useEffect(() => { load(); }, [load]);

  const filtered = alertes.filter(a =>
    !search || a.description?.toLowerCase().includes(search.toLowerCase())
      || a.citoyenName?.toLowerCase().includes(search.toLowerCase())
      || a.zoneName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStatut = async (id: number, s: string) => {
    await alertesAPI.updateStatut(id, s).catch(()=>{});
    setAlertes(p => p.map(a => a.id===id ? {...a, statut:s} : a));
    if (selected?.id === id) setSelected(p => p ? {...p, statut:s} : null);
  };

  const handlePrendre = async (alerteId: number) => {
    try {
      await interventionsAPI.create(alerteId);
      handleUpdateStatut(alerteId, "enCours");
    } catch (e:any) { alert(e.response?.data?.message || "Erreur"); }
  };

  const handleSubmit = async () => {
    if (!form.description) return alert("Description requise");
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => v && fd.append(k, v));
      await alertesAPI.create(fd);
      setShowForm(false);
      setForm({ description:"", priorite:"moyenne", latitude:"", longitude:"", zoneId:"" });
      load();
    } catch (e:any) { alert(e.response?.data?.message || "Erreur"); }
    finally { setSubmitting(false); }
  };

  return (
    <IonPage>
      <div style={{ display:"flex", minHeight:"100vh", background:"#EEF2FF" }}>

        <div style={{ marginLeft:15, flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

          <IonContent style={{ "--background":"#EEF2FF" }}>
            <div style={{ padding:"24px 28px" }}>

              {/* ── Toolbar ── */}
              <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
                {/* Search */}
                <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid rgba(59,126,248,.12)", borderRadius:10, padding:"9px 14px", flex:1, minWidth:200 }}>
                  <IonIcon icon={searchOutline} style={{ color:"#94a3b8", fontSize:16 }}/>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..."
                    className="inp-field" style={{ border:"none", background:"transparent", padding:0, flex:1 }}/>
                </div>

                {/* Statut filter */}
                <div style={{ display:"flex", gap:6 }}>
                  {STATUTS.map(s => (
                    <button key={s} onClick={()=>setStatut(s)} style={{
                      padding:"8px 14px", borderRadius:8, border:"1px solid rgba(59,126,248,.15)",
                      background: statut===s ? "#3b7ef8" : "#fff",
                      color:      statut===s ? "#fff"    : "#64748b",
                      fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .2s",
                    }}>{STAT_LABEL[s]}</button>
                  ))}
                </div>

                {/* Priorité filter */}
                <select value={priorite} onChange={e=>setPriorite(e.target.value)}
                  style={{ padding:"9px 14px", borderRadius:10, border:"1px solid rgba(59,126,248,.15)", background:"#fff", fontSize:13, color:"#1e293b", cursor:"pointer" }}>
                  {PRIORITES.map(p => <option key={p} value={p}>{p==="toutes"?"Toutes priorités":p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>

                {/* Add btn */}
                <button className="btn-primary" onClick={()=>setShowForm(true)} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", whiteSpace:"nowrap" }}>
                  <IonIcon icon={addOutline} style={{ fontSize:16 }}/> Nouveau
                </button>
              </div>

              {/* ── Grid ── */}
              {loading ? (
                <div style={{ display:"flex", justifyContent:"center", padding:60 }}>
                  <IonSpinner name="crescent" style={{ "--color":"#3b7ef8", transform:"scale(1.5)" }}/>
                </div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
                  {filtered.map((a, i) => (
                    <div key={a.id} className="card" style={{
                      padding:"18px 20px", cursor:"pointer",
                      animation:`fadeUp .4s ${i*.04}s ease both`, opacity:0, animationFillMode:"forwards",
                      borderLeft:`3px solid ${PRIO_COLOR[a.priorite]||"#94a3b8"}`,
                      transition:"all .25s",
                    }}
                      onClick={() => setSelected(a)}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}
                    >
                      {/* Header */}
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:PRIO_COLOR[a.priorite], flexShrink:0,
                            boxShadow:`0 0 6px ${PRIO_COLOR[a.priorite]}80` }}/>
                          <span style={{ fontSize:11, color:PRIO_COLOR[a.priorite], fontWeight:700, textTransform:"uppercase", letterSpacing:.05 }}>
                            {a.priorite}
                          </span>
                        </div>
                        <span className={`badge badge-${a.statut}`}>{STAT_LABEL[a.statut]||a.statut}</span>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize:14, color:"#1e293b", fontWeight:500, marginBottom:10,
                        overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box",
                        WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                        {a.description || "Signalement citoyen"}
                      </p>

                      {/* Meta */}
                      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94a3b8" }}>
                          <IonIcon icon={personOutline} style={{ fontSize:13 }}/> {a.citoyenName}
                        </div>
                        {a.zoneName && (
                          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94a3b8" }}>
                            <IonIcon icon={locationOutline} style={{ fontSize:13 }}/> {a.zoneName}
                          </div>
                        )}
                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94a3b8" }}>
                          <IonIcon icon={timeOutline} style={{ fontSize:13 }}/> {new Date(a.createdAt).toLocaleString("fr-FR")}
                        </div>
                      </div>

                      {/* Actions */}
                      {(user?.role==="admin"||user?.role==="chauffeur") && a.statut==="enAttente" && (
                        <button onClick={e=>{e.stopPropagation();handlePrendre(a.id);}} style={{
                          marginTop:12, width:"100%", padding:"8px 0",
                          background:"linear-gradient(135deg,#EEF2FF,#DBEAFE)",
                          border:"1px solid rgba(59,126,248,.2)", borderRadius:8,
                          fontSize:12, fontWeight:600, color:"#3b7ef8", cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                          transition:"all .2s",
                        }}
                          onMouseEnter={e=>(e.currentTarget.style.background="linear-gradient(135deg,#DBEAFE,#BFDBFE)")}
                          onMouseLeave={e=>(e.currentTarget.style.background="linear-gradient(135deg,#EEF2FF,#DBEAFE)")}
                        >
                          <IonIcon icon={carOutline} style={{ fontSize:14 }}/> Prendre en charge
                        </button>
                      )}
                      {(user?.role==="admin"||user?.role==="chauffeur") && a.statut==="enCours" && (
                        <button onClick={e=>{e.stopPropagation();handleUpdateStatut(a.id,"traite");}} style={{
                          marginTop:12, width:"100%", padding:"8px 0",
                          background:"linear-gradient(135deg,#D1FAE5,#A7F3D0)",
                          border:"1px solid rgba(16,185,129,.2)", borderRadius:8,
                          fontSize:12, fontWeight:600, color:"#059669", cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                        }}>
                          <IonIcon icon={checkmarkOutline} style={{ fontSize:14 }}/> Marquer traitée
                        </button>
                      )}
                    </div>
                  ))}
                  {!filtered.length && !loading && (
                    <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 0", color:"#94a3b8" }}>
                      <IonIcon icon={alertCircleOutline} style={{ fontSize:48, marginBottom:12, display:"block" }}/>
                      <p>Aucune alerte trouvée</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </IonContent>
        </div>
      </div>

      {/* ── Détail drawer ── */}
      {selected && (
        <div onClick={()=>setSelected(null)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.35)",
          zIndex:300, display:"flex", justifyContent:"flex-end",
          animation:"fadeIn .2s ease",
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            width:420, background:"#fff", height:"100%", overflowY:"auto",
            padding:28, boxShadow:"-8px 0 32px rgba(0,0,0,.12)",
            animation:"slideR .3s ease both",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:18 }}>Détail Alerte #{selected.id}</h2>
              <button onClick={()=>setSelected(null)} style={{ background:"#F1F5F9", border:"none", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:18 }}>×</button>
            </div>
            {selected.imageUrl && (
              <img src={`http://localhost:3000${selected.imageUrl}`} alt="" style={{ width:"100%", height:200, objectFit:"cover", borderRadius:12, marginBottom:20 }}/>
            )}
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              <span className={`badge badge-${selected.statut}`}>{STAT_LABEL[selected.statut]}</span>
              <span style={{ fontSize:12, fontWeight:700, color:PRIO_COLOR[selected.priorite] }}>● {selected.priorite}</span>
            </div>
            <p style={{ fontSize:14, color:"#1e293b", lineHeight:1.7, marginBottom:20 }}>{selected.description}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, fontSize:13, color:"#64748b" }}>
              <div><strong>Citoyen :</strong> {selected.citoyenName}</div>
              <div><strong>Zone :</strong> {selected.zoneName || "—"}</div>
              <div><strong>Date :</strong> {new Date(selected.createdAt).toLocaleString("fr-FR")}</div>
              {selected.latitude && <div><strong>GPS :</strong> {selected.latitude}, {selected.longitude}</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── Formulaire ajout ── */}
      {showForm && (
        <div onClick={()=>setShowForm(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.35)", zIndex:300,
          display:"flex", alignItems:"center", justifyContent:"center",
          animation:"fadeIn .2s ease",
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:"#fff", borderRadius:20, padding:32, width:460,
            boxShadow:"0 24px 64px rgba(0,0,0,.18)",
            animation:"scaleIn .3s ease both",
          }}>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:18, marginBottom:20 }}>Nouveau Signalement</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>Description *</label>
                <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}
                  rows={3} className="inp-field" style={{ resize:"vertical" }} placeholder="Décrivez le problème..."/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>Priorité</label>
                  <select value={form.priorite} onChange={e=>setForm(p=>({...p,priorite:e.target.value}))}
                    className="inp-field" style={{ cursor:"pointer" }}>
                    <option value="faible">Faible</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="elevee">Élevée</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>Zone</label>
                  <select value={form.zoneId} onChange={e=>setForm(p=>({...p,zoneId:e.target.value}))}
                    className="inp-field" style={{ cursor:"pointer" }}>
                    <option value="">— Sélectionner —</option>
                    {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>Latitude</label>
                  <input type="number" value={form.latitude} onChange={e=>setForm(p=>({...p,latitude:e.target.value}))}
                    className="inp-field" placeholder="4.0511"/>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>Longitude</label>
                  <input type="number" value={form.longitude} onChange={e=>setForm(p=>({...p,longitude:e.target.value}))}
                    className="inp-field" placeholder="9.7679"/>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:24 }}>
              <button onClick={()=>setShowForm(false)} style={{
                flex:1, padding:"11px 0", borderRadius:10, border:"1px solid #e2e8f0",
                background:"#F8FAFF", fontSize:14, fontWeight:600, color:"#64748b", cursor:"pointer",
              }}>Annuler</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary" style={{ flex:1, padding:"11px 0" }}>
                {submitting ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </IonPage>
  );
};

export default AlertesPage;
