import React, { useState } from "react";
import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { leafOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, arrowForwardOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { authAPI } from "../services/api";
import { useStore } from "../store";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes bgBreath { from{filter:hue-rotate(0deg)} to{filter:hue-rotate(12deg)} }
  @keyframes gridDrift { from{background-position:0 0} to{background-position:48px 48px} }
  @keyframes orbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-22px)} }
  @keyframes orbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-22px,26px)} }
  @keyframes logoRing { 0%,100%{box-shadow:0 0 0 0 rgba(59,126,248,.4)} 50%{box-shadow:0 0 0 10px rgba(59,126,248,0)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn{ from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
  @keyframes spin { to{transform:rotate(360deg)} }

  .rg-logo {
  display:flex; align-items:center; gap:12px;
  animation: fadeUp .8s .1s ease both;
  opacity:0; animation-fill-mode:forwards;
}
.rg-logo-ring {
  width:46px; height:46px; border-radius:50%;
  background:linear-gradient(135deg,#176b3c,#3db87a);
  display:flex; align-items:center; justify-content:center;
  position:relative;
  animation:logoPulse 2.8s ease-in-out infinite;
}
.rg-logo-ring::before {
  content:''; position:absolute; inset:-5px;
  border-radius:50%; border:1.5px solid rgba(61,184,122,0.3);
  animation:ringOut 2.8s ease-in-out infinite;
}
@keyframes logoPulse {
  0%,100%{box-shadow:0 0 0 0 rgba(61,184,122,0.4),0 4px 16px rgba(61,184,122,0.3)}
  50%    {box-shadow:0 0 0 9px rgba(61,184,122,0.0),0 4px 26px rgba(61,184,122,0.55)}
}
@keyframes ringOut {
  0%,100%{transform:scale(1);opacity:.5}
  50%    {transform:scale(1.35);opacity:0}
}
.rg-logo-name {
  font-family:'Playfair Display',serif;
  font-weight:800; font-size:22px; color:#fff; letter-spacing:.5px;
}
.rg-logo-accent { color:#3db87a; }
`;

const Login: React.FC = () => {
  const history = useHistory();
  const { setUser, setToken } = useStore();
  const [form,     setForm]     = useState({ email:"", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

const handleLogin = async () => {
  setError("");

  if (!form.email || !form.password) {
    return setError("Remplissez tous les champs");
  }

  setLoading(true);

  try {
    const r = await authAPI.login({
      email: form.email.trim(),
      password: form.password,
    });

    // sécurité : vérification réponse backend
    if (!r?.data) {
      throw new Error("Réponse serveur invalide");
    }

    const { token, user } = r.data;

    if (!token || !user) {
      throw new Error("Données de connexion invalides");
    }

    setToken(token);
    setUser(user);

    history.push("/dashboard");

  } catch (e: any) {
    console.log("LOGIN ERROR FRONT:", e);

    setError(
      e.response?.data?.message ||
      e.message ||
      "Erreur de connexion au serveur"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <IonPage>
      <style>{STYLES}</style>
      <IonContent fullscreen scrollY={false}>
        {/* Animated background */}
        <div style={{ position:"fixed", inset:0, background:"#020C1B", animation:"bgBreath 14s ease-in-out infinite alternate" }}>
          <div style={{ position:"absolute", inset:0,
            backgroundImage:"linear-gradient(rgba(59,126,248,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(59,126,248,.055) 1px,transparent 1px)",
            backgroundSize:"48px 48px", animation:"gridDrift 22s linear infinite" }}/>
          <div style={{ position:"absolute", width:500,height:500,borderRadius:"50%",filter:"blur(80px)",background:"rgba(59,126,248,.14)",top:-150,left:-120, animation:"orbA 10s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", width:380,height:380,borderRadius:"50%",filter:"blur(80px)",background:"rgba(16,185,129,.08)",bottom:-100,right:-80, animation:"orbB 13s ease-in-out infinite" }}/>
        </div>

        {/* Card */}
        <div style={{ position:"relative", zIndex:10, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{
            background:"rgba(255, 255, 255, 0.86)", borderRadius:24, width:"min(92vw,440px)",
            boxShadow:"0 0 0 1px rgba(59,126,248,.12),0 40px 80px rgba(0,0,0,.25)",
            overflow:"hidden", animation:"scaleIn .7s cubic-bezier(.22,1,.36,1) both",
          }}>
            {/* Blue top accent */}
            <div style={{ height:5, background:"linear-gradient(90deg,#3b7ef8,#1d4ed8,#10b981)" }}/>

            <div style={{ padding:"36px 36px 32px" }}>
              {/* Logo */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32, animation:"fadeUp .6s .1s ease both", opacity:0, animationFillMode:"forwards" }}>
              <div className="rg-logo">
                <div className="rg-logo-ring">
                  <IonIcon icon={leafOutline} style={{ color:"#fff", fontSize:"20px" }} />
                </div>
                <span className="rg-logo-name">
                  Eco<span className="rg-logo-accent ">Alert</span>
                </span>
              </div>
              </div>

              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:24,color:"#1e293b",marginBottom:6, animation:"fadeUp .6s .2s ease both",opacity:0,animationFillMode:"forwards" }}>
                Connexion
              </h2>
              <p style={{ fontSize:13,color:"#94a3b8",marginBottom:28, animation:"fadeUp .6s .25s ease both",opacity:0,animationFillMode:"forwards" }}>
                Accédez à votre espace personnel
              </p>

              {error && (
                <div style={{ padding:"11px 14px",borderRadius:10,background:"#FEE2E2",border:"1px solid rgba(239,68,68,.2)",fontSize:13,color:"#dc2626",marginBottom:18,
                  animation:"fadeUp .3s ease both" }}>
                  {error}
                </div>
              )}

              <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
                {/* Email */}
                <div style={{ animation:"fadeUp .5s .3s ease both",opacity:0,animationFillMode:"forwards" }}>
                  <label style={{ fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:7,letterSpacing:.05,textTransform:"uppercase" }}>
                    Email
                  </label>
                  <div style={{ position:"relative",border:"1.5px solid #e2e8f0",borderRadius:12,background:"#F8FAFF",transition:"all .2s" }}
                    onFocusCapture={e=>(e.currentTarget.style.borderColor="#3b7ef8")}
                    onBlurCapture={e=>(e.currentTarget.style.borderColor="#e2e8f0")}
                  >
                    <IonIcon icon={mailOutline} style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:16 }}/>
                    <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                      onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                      style={{ width:"100%",padding:"12px 14px 12px 40px",border:"none",background:"transparent",fontSize:14,color:"#1e293b",outline:"none",fontFamily:"'DM Sans',sans-serif" }}
                      placeholder="vous@exemple.com"/>
                  </div>
                </div>

                {/* Password */}
                <div style={{ animation:"fadeUp .5s .36s ease both",opacity:0,animationFillMode:"forwards" }}>
                  <label style={{ fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:7,letterSpacing:.05,textTransform:"uppercase" }}>
                    Mot de passe
                  </label>
                  <div style={{ position:"relative",border:"1.5px solid #e2e8f0",borderRadius:12,background:"#F8FAFF",transition:"all .2s" }}
                    onFocusCapture={e=>(e.currentTarget.style.borderColor="#3b7ef8")}
                    onBlurCapture={e=>(e.currentTarget.style.borderColor="#e2e8f0")}
                  >
                    <IonIcon icon={lockClosedOutline} style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:16 }}/>
                    <input type={showPass?"text":"password"} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                      onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                      style={{ width:"100%",padding:"12px 44px 12px 40px",border:"none",background:"transparent",fontSize:14,color:"#1e293b",outline:"none",fontFamily:"'DM Sans',sans-serif" }}
                      placeholder="••••••••"/>
                    <button onClick={()=>setShowPass(p=>!p)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",cursor:"pointer",color:"#94a3b8",display:"flex" }}>
                      <IonIcon icon={showPass?eyeOffOutline:eyeOutline} style={{ fontSize:16 }}/>
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button onClick={handleLogin} disabled={loading} style={{
                  width:"100%",padding:"13px",borderRadius:12,
                  background:"linear-gradient(135deg,#3b7ef8,#1d4ed8)",
                  border:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",
                  fontWeight:700,fontSize:15,cursor:loading?"not-allowed":"pointer",
                  boxShadow:"0 6px 20px rgba(59,126,248,.4)",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  transition:"all .2s",
                  animation:"fadeUp .5s .42s ease both",opacity:0,animationFillMode:"forwards",
                }}
                  onMouseEnter={e=>!loading&&(e.currentTarget.style.transform="translateY(-1px)")}
                  onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}
                >
                  {loading ? (
                    <div style={{ width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .6s linear infinite" }}/>
                  ) : (
                    <><span>Se connecter</span><IonIcon icon={arrowForwardOutline} style={{ fontSize:16 }}/></>
                  )}
                </button>
              </div>

              <p style={{ textAlign:"center",marginTop:20,fontSize:13,color:"#94a3b8", animation:"fadeUp .5s .48s ease both",opacity:0,animationFillMode:"forwards" }}>
                Pas encore de compte ?{" "}
                <span onClick={()=>history.push("/register")} style={{ color:"#3b7ef8",fontWeight:700,cursor:"pointer" }}>
                  S'inscrire
                </span>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
